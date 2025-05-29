<template>
  <div :id="id" :class="keypadClass" v-show="show" @click="stopPropagation && $event.stopPropagation()">
    <div :class="buttonWrapClass">
      <button
        v-for="(val, idx) in keyArray"
        :key="idx"
        ref="buttonRefs"
        type="button"
        :class="setClass(val, idx)"
        @pointerup="click(val, idx, $event)"
      >
        {{ showKey(val) }}
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, -1];
const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "", -1];

export default {
  name: "VueNumericKeypad",
  props: {
    id: {
      type: String,
      required: false,
    },
    value: {
      type: String,
      default: "",
      required: true,
    },
    show: {
      type: [Boolean, Number],
      default: false,
      required: true,
    },
    encryptFunc: {
      type: Function,
      default: c => c,
    },
    encryptedValue: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => ({}),
      validator: function (value) {
        const keyArrayDisable = (value.keyArray || []).some(key => {
          switch (typeof key) {
            case 'number':
              return (!Number.isInteger(key) || key < -2 || key > 9);
            case 'string':
              return key;
            default:
              return false;
          }
        });
        if (keyArrayDisable) {
          console.error("KeyArray can contain only an integer 'number' between -2 and 9 and an empty 'string'.");
          return false;
        }
        const classDisable = Object.keys(value).some(key => /Class/.test(key) && /[^0-9A-z\-_ ]/.test(value[key]));
        if (classDisable) {
          console.error("Class name can contain only 'a-z' and 'A-Z', '0-9', '_', '-', ' '.");
          return false;
        }
        return true;
      },
      required: false,
    },
  },
  emits: ['update:value', 'update:encryptedValue'],
  setup(props, { emit }) {
    const buttonRefs = ref([])
    const columns = Number(props.options.columns) || 3
    
    // Reactive data
    const state = reactive({
      encrypt: Boolean(props.options.encrypt),
      encryptedChar: typeof props.options.encryptedChar === 'string' ? props.options.encryptedChar.substring(0, 1) : "0",
      keyArray: props.options.keyArray || (columns === 3 ? arr1 : arr2),
      keyRandomize: Boolean(props.options.keyRandomize === undefined || props.options.keyRandomize),
      randomizeWhenClick: Boolean(props.options.randomizeWhenClick),
      fixDeleteKey: Boolean(props.options.fixDeleteKey === undefined || props.options.fixDeleteKey),
      fixBlankKey: Boolean(props.options.fixBlankKey === undefined || props.options.fixBlankKey),
      stopPropagation: Boolean(props.options.stopPropagation === undefined || props.options.stopPropagation),
      keypadClass: props.options.keypadClass || 'numeric-keypad',
      buttonWrapClass: props.options.buttonWrapClass || 'numeric-keypad__button-wrap',
      buttonClass: props.options.buttonClass || 'numeric-keypad__button',
      deleteButtonClass: props.options.deleteButtonClass || 'numeric-keypad__button--delete',
      clearButtonClass: props.options.clearButtonClass || 'numeric-keypad__button--clear',
      blankButtonClass: props.options.blankButtonClass || 'numeric-keypad__button--blank',
      activeButtonClass: props.options.activeButtonClass || 'numeric-keypad__button--active',
      activeButtonIndexes: {},
      activeButtonDelay: Number(props.options.activeButtonDelay) || 300,
      pseudoClick: Boolean(props.options.pseudoClick),
      pseudoClickDeleteKey: props.options.pseudoClickDeleteKey === undefined ? Boolean(props.options.pseudoClick) : Boolean(props.options.pseudoClickDeleteKey),
      pseudoClickBlankKey: props.options.pseudoClickBlankKey === undefined ? Boolean(props.options.pseudoClick) : Boolean(props.options.pseudoClickBlankKey),
      vibrate: Boolean(props.options.vibrate),
      vibratePattern: props.options.vibratePattern || 200,
      rows: Number(props.options.rows) || 4,
      columns,
      zIndex: Number(props.options.zIndex) || 1,
      cellWidth: 0,
      cellHeight: 0,
      defaultStyleSheet: document.createElement('style'),
      defaultStyle: ['all', 'button', 'wrap', 'none'].find(s => s === props.options.defaultStyle) || 'all',
      keypadStylesIndex: null,
      deleteKeyText: props.options.deleteKeyText === undefined ? 'del' : props.options.deleteKeyText,
      clearKeyText: props.options.clearKeyText === undefined ? 'clr' : props.options.clearKeyText,
    })

    // Watchers
    watch(() => props.show, () => {
      nextTick(() => {
        if (props.show) resize()
      })
      if (state.keyRandomize) randomize()
    })

    watch(() => props.options, (options) => {
      if (typeof options !== 'object') return
      const columns = Number(options.columns) || 3
      state.encryptedChar = typeof options.encryptedChar === 'string' ? options.encryptedChar.substring(0, 1) : "0"
      state.keyArray = options.keyArray || (columns === 3 ? arr1 : arr2)
      state.keyRandomize = Boolean(options.keyRandomize === undefined || options.keyRandomize)
      state.randomizeWhenClick = Boolean(options.randomizeWhenClick)
      state.fixDeleteKey = Boolean(options.fixDeleteKey === undefined || options.fixDeleteKey)
      state.fixBlankKey = Boolean(options.fixBlankKey === undefined || options.fixBlankKey)
      state.stopPropagation = Boolean(options.stopPropagation === undefined || options.stopPropagation)
      state.activeButtonDelay = Number(options.activeButtonDelay) || 300
      state.pseudoClick = Boolean(options.pseudoClick)
      state.pseudoClickDeleteKey = options.pseudoClickDeleteKey === undefined ? Boolean(options.pseudoClick) : Boolean(options.pseudoClickDeleteKey)
      state.pseudoClickBlankKey = options.pseudoClickBlankKey === undefined ? Boolean(options.pseudoClick) : Boolean(options.pseudoClickBlankKey)
      state.vibrate = Boolean(options.vibrate)
      state.vibratePattern = state.vibratePattern || 200
      state.rows = Number(options.rows) || 4
      state.zIndex = Number(options.zIndex) || 1
      state.deleteKeyText = options.deleteKeyText === undefined ? 'del' : options.deleteKeyText
      state.clearKeyText = options.clearKeyText === undefined ? 'clr' : options.clearKeyText
      const defaultStyle = ['all', 'button', 'wrap', 'none'].find(s => s === options.defaultStyle) || 'all'
      if (state.defaultStyle !== defaultStyle) {
        state.defaultStyle = defaultStyle
        document.head.removeChild(state.defaultStyleSheet)
        state.defaultStyleSheet = document.createElement('style')
        if (state.defaultStyle !== 'none') {
          document.head.appendChild(state.defaultStyleSheet)
          initDefaultStyles(state.defaultStyleSheet.sheet)
        }
      }
      if (state.keyRandomize) randomize()
    }, { deep: true })

    // Computed properties
    // Computed properties
    const keypadStyles = computed(() => {
      const fontSize = Math.round(Math.min(state.cellWidth, state.cellHeight) * 0.3)
      const style = `
        position: fixed;
        z-index: ${state.zIndex};
        bottom: 0;
        left: 0;
        right: 0;
        height: 40vh;
        padding: 10px;
        background-color: #fff;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.15);
        color: #000;
        overflow: hidden;
      `
      return fontSize ? style + `\nfont-size: ${fontSize}px;` : style
    })

    const buttonWrapStyles = computed(() => {
      return `
        display: flex;
        witdth: 100%;
        height: 100%;
        justify-content: space-between;
        align-content: space-between;
        flex-wrap: wrap;
        gridGap: 5px;
      `
    })

    const buttonStyles = computed(() => {
      const width = `calc(${Math.round(1000 / state.columns) / 10}% - ${Math.ceil(5 * (state.columns - 1) / state.columns)}px)`
      const height = `calc(${Math.round(1000 / state.rows) / 10}% - ${Math.ceil(5 * (state.rows - 1) / state.rows)}px)`
      return `
        flex: 0 0 auto;
        display: flex;
        width: ${width};
        height: ${height};
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 8px;
        font-size: inherit;
      `
    })

    // Methods
    const click = (key, idx, event) => {
      if (!event.isTrusted) return
      if (state.pseudoClick) {
        if (!(((key == -1 || key == -2) && !state.pseudoClickDeleteKey) || (key == '' && !state.pseudoClickBlankKey))) {
          const l = state.keyArray.length
          const pIdx = Math.floor((Math.random() * (l - 1)) + idx + 1) % l
          activeButton(pIdx)
        }
      }
      activeButton(idx)
      if (state.vibrate && window.navigator.vibrate) window.navigator.vibrate(state.vibratePattern)
      switch (key) {
        case -1:
          del()
          break
        case -2:
          clear()
        case "":
          break
        default:
          add(key)
          break
      }
      if (state.keyRandomize && state.randomizeWhenClick) randomize()
    }

    const del = () => {
      const encryptedValue = [...props.encryptedValue]
      const newVal = props.value.slice(0, -1)
      emit("update:value", String(newVal))
      if (state.encrypt) {
        encryptedValue.pop()
        emit("update:encryptedValue", encryptedValue)
      }
    }

    const clear = () => {
      emit("update:value", '')
      if (state.encrypt) emit("update:encryptedValue", [])
    }

    const add = (key) => {
      const encryptedValue = [...props.encryptedValue]
      let newVal = props.value
      if (state.encrypt) {
        newVal += state.encryptedChar
        encryptedValue.push(props.encryptFunc(key.toString()))
        emit("update:encryptedValue", encryptedValue)
      } else {
        newVal += key
      }
      emit("update:value", String(newVal))
    }

    const randomize = () => {
      const l = state.keyArray.length
      const newkeyArray = [...state.keyArray]
      for (let i = 0; i < l; i++) {
        const key = newkeyArray[i]
        if (checkFix(key)) continue

        let r = Math.floor(Math.random() * l)
        if (r == i) r = (r + 1) % l
        let count = 0
        while ((checkFix(newkeyArray[r]) || newkeyArray[r] === newkeyArray[i]) && count < l) {
          r = (r + 1) % l
          count++
        }
        if (count >= l) continue
        newkeyArray[i] = newkeyArray[r]
        newkeyArray[r] = key
      }
      state.keyArray = newkeyArray
    }

    const checkFix = (key) => {
      if (key === '' && state.fixBlankKey) return true
      if (key === -1 && state.fixDeleteKey) return true
      if (key === -2 && state.fixDeleteKey) return true
      return false
    }

    const showKey = (key) => {
      if (key === -1) {
        return state.deleteKeyText
      } else if (key === -2) {
        return state.clearKeyText
      } else return key
    }

    const resize = () => {
      state.cellWidth = buttonRefs.value[0].offsetWidth
      state.cellHeight = buttonRefs.value[0].offsetHeight
      const sheet = state.defaultStyleSheet.sheet
      if (sheet && state.keypadStylesIndex !== null) {
        sheet.deleteRule(0)
        sheet.insertRule(`.${state.keypadClass.trim().split(' ')[0]} {${keypadStyles.value}}`, 0)
      }
    }

    const setClass = (key, idx) => {
      const classArr = [state.buttonClass]
      if (key === -1) {
        classArr.push(state.deleteButtonClass)
      }
      if (key === -2) {
        classArr.push(state.clearButtonClass)
      }
      if (key === '') {
        classArr.push(state.blankButtonClass)
      }
      if (state.activeButtonIndexes[idx]) {
        classArr.push(state.activeButtonClass)
      }
      return classArr
    }

    const activeButton = (idx) => {
      if (state.activeButtonIndexes[idx]) {
        clearTimeout(state.activeButtonIndexes[idx])
      } else {
        buttonRefs.value[idx].classList.add(state.activeButtonClass)
      }
      state.activeButtonIndexes[idx] = setTimeout(() => {
        buttonRefs.value[idx].classList.remove(state.activeButtonClass)
        clearTimeout(state.activeButtonIndexes[idx])
        delete state.activeButtonIndexes[idx]
      }, state.activeButtonDelay)
    }

    const initDefaultStyles = (sheet) => {
      if (state.defaultStyle === 'none') return
      const test = /[^0-9A-z\-_ ]/
      let padIndex = 0
      if (state.defaultStyle !== 'button') {
        if (!test.test(state.keypadClass)) {
          state.keypadStylesIndex = padIndex
          sheet.insertRule(`.${state.keypadClass.trim().split(' ')[0]} {${keypadStyles.value}}`, padIndex++)
        }
        if (!test.test(state.buttonWrapClass)) {
          sheet.insertRule(`.${state.buttonWrapClass.trim().split(' ')[0]} {${buttonWrapStyles.value}}`, padIndex++)
        }
      }
      if (state.defaultStyle !== 'wrap') {
        if (!test.test(state.buttonClass)) {
          sheet.insertRule(`.${state.buttonClass.trim().split(' ')[0]} {${buttonStyles.value}}`, padIndex++)
          if (!test.test(state.activeButtonClass)) {
            sheet.insertRule(`.${state.buttonClass.trim().split(' ')[0]}.${state.activeButtonClass.trim().split(' ')[0]} {background-color: #eaeaea;}`, padIndex++)
          }
        }
      }
    }

    // Lifecycle
    onMounted(() => {
      window.addEventListener('resize', resize)
      if (state.defaultStyle !== 'none') {
        document.head.appendChild(state.defaultStyleSheet)
        initDefaultStyles(state.defaultStyleSheet.sheet)
      }
      if (state.keyRandomize) randomize()
      resize()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize)
    })

    return {
      buttonRefs,
      ...state,
      keypadStyles,
      buttonWrapStyles, 
      buttonStyles,
      click,
      del,
      clear,
      add,
      randomize,
      checkFix,
      showKey,
      resize,
      setClass,
      activeButton,
      initDefaultStyles
    }
  }
}
</script>

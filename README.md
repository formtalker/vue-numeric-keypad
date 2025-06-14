# Vue Numeric Keypad [![npm](https://img.shields.io/npm/v/@formtalker/vue-numeric-keypad)](https://img.shields.io/npm/v/@formtalker/vue-numeric-keypad) [![npm dev dependency version](https://img.shields.io/npm/dependency-version/@formtalker/vue-numeric-keypad/dev/vue)](https://www.npmjs.com/package/vue/v/3.3.0)
The virtual numeric keypad that can be used on Vue 3.
It was updated to support Vue 3.3.0+ environments with Composition API.
By default, keys are randomly arranged and you can specify various settings using options.

## Installation

```bash
npm i @formtalker/vue-numeric-keypad
```

## Usage

### Usage with Module

#### Vue 3 with Composition API using `<script setup>` (Recommended)
```vue
<template>
  <div id="app">
    <input
      type="number"
      :value="value"
      @click.stop="show = true"
      readonly
    />
    <VueNumericKeypad
      v-model:value="value"
      v-model:show="show"
      :options="options"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import VueNumericKeypad from "vue-numeric-keypad";

const value = ref("")
const show = ref(0)
// Using reactive for object options
const options = reactive({
  keyRandomize: true,
  randomizeWhenClick: true,
  fixDeleteKey: false,
})

const handleDocumentClick = () => {
  show.value = 0
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>
```

#### Vue 3 with Composition API using `setup()` function
```vue
<template>
  <div id="app">
    <input
      type="number"
      :value="value"
      @click.stop="show = true"
      readonly
    />
    <VueNumericKeypad
      v-model:value="value"
      v-model:show="show"
      :options="options"
    />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import VueNumericKeypad from "vue-numeric-keypad";

export default {
  name: "App",
  components: {
    VueNumericKeypad,
  },
  setup() {
    const value = ref("")
    const show = ref(0)
    const options = ref({
      keyRandomize: true,
      randomizeWhenClick: true,
      fixDeleteKey: false,
    })

    const handleDocumentClick = () => {
      show.value = 0
    }

    onMounted(() => {
      document.addEventListener('click', handleDocumentClick)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleDocumentClick)
    })

    return {
      value,
      show,
      options
    }
  }
}
</script>
```

#### Vue 3 with Options API
```vue
<template>
  <div id="app">
    <input
      type="number"
      :value="value"
      @click.stop="show = true"
      readonly
    />
    <VueNumericKeypad
      v-model:value="value"
      v-model:show="show"
      :options="options"
    />
  </div>
</template>

<script>
import VueNumericKeypad from "vue-numeric-keypad";

export default {
  name: "App",
  components: {
    VueNumericKeypad,
  },
  data() {
    return {
      value: "",
      show: 0,
      options: {
        keyRandomize: true,
        randomizeWhenClick: true,
        fixDeleteKey: false,
      },
    };
  },
  mounted() {
    document.addEventListener('click', this.handleDocumentClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  },
  methods: {
    handleDocumentClick() {
      this.show = 0;
    }
  }
};
</script>
```

### Usage with CDN
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-numeric-keypad@latest/dist/vue-numeric-keypad.min.js"></script>
<script>
  const { createApp } = Vue;
  createApp({
    setup() {
      // Your component logic here
    }
  }).use(VueNumericKeypad).mount('#app');
</script>
...
<vue-numeric-keypad
  v-model:value="value"
  v-model:show="show"
  :options="options"
/>
```
## Demo

https://chae-sumin.github.io/vue-numeric-keypad/

## Props and Options

The props have to deliver changing values or objects, so bind them with `v-bind:` or `:`.
In addition, `value` and `show`, `encryptedValue` require two-way binding, so use `v-model` directive.

### props
|property|Description|Required|type|
|-|-|-|-|
|`id`|ID of the keypad.|False|String|
|`v-model:value`|The value to change when entering the keypad.|True|String \| <br> String variable|
|`v-model:encryptedValue` \| `v-model:encrypted-value`|Array in which encrypted values will be entered<br>when `options.encrypt: true`.|False|Array&lt;string&gt; variable|
|`v-model:show`|Bind to the v-show on the keypad. And adjust the font size and randomize the key arrangement.|True|Boolean variable \|<br> Number variable |
|`:encryptFunc` \| `:encrypt-func`|A function that encrypts the input<br>when `options.encrypt: true`.|False|Function|
|`:options`|Set several values.<br>(details can be found below)|False|Object|
### options
|option|Description|type|default|
|-|-|-|-|
|`keyRandomize`|Randomize the key array whenever the `show` prop changes.|Boolean|true|
|`randomizeWhenClick`|If the value is true and `keyRandomize` is true, randomize the key array whenever you press the key.|Boolean|false|
|`fixDeleteKey`|The delete key is fixed when the key array is randomized.|Boolean|true|
|`fixBlankKey`|The Blank key is fixed when the key array is randomized.|Boolean|true|
|`zIndex`|Sets the z-index value.<br>Valid when `keypadStyles` is the default.|Number|1|
|`rows`|Sets the number of rows in the key array.<br>Valid when `buttonWrapStyles` is the default.|Number|4|
|`columns`|Sets the number of columns in the key array.<br>Valid when `buttonWrapStyles` is the default.|Number|3|
|`keyArray`|Can only have an integer 'number' between -2 and 9 and an empty 'string' type.<br>-1 means the delete key and -2 means the clear key|Array&lt;number\|string&gt;|`columns` === 3 ?<br>[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, -1] :<br>[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "", -1]|
|`deleteKeyText`|Delete Button Text|String|'del'|
|`clearKeyText`|Clear Button Text|String|'clr'|
|`encrypt`|Using encryption|Boolean|false|
|`encryptedChar`|Will be placed in `:value.sync` of the original value.<br>For strings of length greater than 1, only the first character is valid.|String|'0'|
|`activeButtonDelay`|The time when `activeButtonClass` is maintained (ms)|Number|300|
|`pseudoClick`|Clicking a button triggers a pseudo click on another button|Boolean|false|
|`pseudoClickDeleteKey`|Clicking the delete button and clear button triggers a pseudo click on another button|Boolean|`pseudoClick`|
|`pseudoClickBlankKey`|Clicking the blank button triggers a pseudo click on another button|Boolean|`pseudoClick`|
|`defaultStyle`|'all': Use All default styles<br>'button': Use `buttonStyles`, `activeButtonStyles` default styles<br>'wrap': Use `keypadStyles`, `buttonWrapStyles` default styles<br>'none': Not use all default styles|'all' \| 'button' \| 'wrap' \| 'none'|'all'|
|`stopPropagation`|Prevents the propagation of events that turn off `:show.sync`.|Boolean|true|
|`vibrate`|Using vibrate ([reference](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API))|Boolean|true|
|`vibratePattern`|Vibrate pattern ([reference](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API))|Number \| <br>Array&lt;number&gt;|true|

> #### class option
> The class option must meet the following conditions:
> - Only 'a-z' and 'A-Z', '0-9', '_', '-', ' ' can be contained
> - Use ' ' to separate classes.
> - The default style applies to the first class.
>
> |property|default|
> |-|-|
> |`keypadClass`|'numeric-keypad'|
> |`buttonWrapClass`|'numeric-keypad__button-wrap'|
> |`buttonClass`|'numeric-keypad__button'|
> |`deleteButtonClass`|'numeric-keypad__button--delete'|
> |`clearButtonClass`|'numeric-keypad__button--clear'|
> |`blankButtonClass`|'numeric-keypad__button--blank'|
> |`activeButtonClass`|'numeric-keypad__button--active'|

### styles defaults
`keypadStyles` :
```css
// The font size changes automatically when the button size changes.
// fontSize = Math.min(cellWidth, cellHeight) * 0.3;
.${keypadClass} {
  position: fixed;
  z-index: ${zIndex};
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
  font-size: ${fontSize}px; // When fontSize != 0
}
```
`buttonWrapStyles` :
```css
.${buttonWrapClass} {
  display: flex;
  witdth: 100%;
  height: 100%;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
  gridGap: 5px;
}
```
`buttonStyles` :
```css
// const width = `calc(${Math.round(1000 / columns) / 10}% - ${Math.ceil(5 * (columns - 1) / columns)}px)`;
// const height = `calc(${Math.round(1000 / rows) / 10}% - ${Math.ceil(5 * (rows - 1) / rows)}px)`;
.${buttonClass} {
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
}
```
`activeButtonStyles` :
```css
// Specificity (0, 2, 0)
.${buttonClass}.${activeButtonClass} {
  background-color: #eaeaea;
}
```

## Tip
 - Detect and act on when options are changed. (However, class-related options and `encrypt` are excluded)
 - When options are changed, if `keyRandomize` is true, the key array is changed randomly.
 - You can bind only one value to one keypad, or you can bind multiple values.
 - You can always keep the value of the show true and adjust the position of the keypad so that the keypad can always be located in a fixed layout.
 - You don't have to always bind the visible value.
 - If you match the total length of the optional `keyArray` with the total length of the keypad, the design will not break.
 - You can use `Slot`
 ```html
 <VueNumericKeypad
      v-model:value="value"
      v-model:show="show"
      :options="options"
>
  <div>Something you want</div>
</VueNumericKeypad>
 ```

## Migration from Vue 2 to Vue 3

If you're migrating from Vue 2, here are the main changes:

### Syntax Changes
- Replace `.sync` modifier with `v-model:`
  ```html
  <!-- Vue 2 -->
  <VueNumericKeypad :value.sync="value" :show.sync="show" />
  
  <!-- Vue 3 -->
  <VueNumericKeypad v-model:value="value" v-model:show="show" />
  ```

### Component Registration
- Vue 2: `Vue.use(VueNumericKeypad)`
- Vue 3: `app.use(VueNumericKeypad)`

### Composition API (Recommended)
Use Composition API for better TypeScript support and modern Vue development patterns.

## License

[![NPM](https://img.shields.io/npm/l/vue-numeric-keypad)](https://github.com/Chae-Sumin/vue-numeric-keypad/blob/master/LICENSE)

## Contact

cotnmin@gmail.com

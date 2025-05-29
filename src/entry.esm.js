
// Import vue component
import component from '@/vue-numeric-keypad.vue';

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via app.use() as well as app.component(),
export default /*#__PURE__*/(() => {
  // Get component instance
  const installable = component;

  // Attach install function executed by app.use()
  installable.install = (app) => {
    app.component('VueNumericKeypad', installable);
  };
  return installable;
})();

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

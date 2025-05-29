const devPresets = ['@vue/cli-plugin-babel/preset'];
const buildPresets = [
  [
    '@babel/preset-env',
    // Config for @babel/preset-env
    {
      // Example: Always transpile optional chaining/nullish coalescing
      // include: [
      //   /(optional-chaining|nullish-coalescing)/
      // ],
    },
  ],
];

export default {
  presets: (process.env.NODE_ENV === 'development' ? devPresets : buildPresets),
};

module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@components": "./src/components",
          "@screens": "./src/screens",
          "@utils": "./src/utils",
          "@assets": "./assets",
          "@theme": "./src/theme",
          "@redux": "./src/redux",
          "@hooks": "./src/hooks",
        },
      },
    ],
    // Correctly nested within the plugins array
    ["react-native-reanimated/plugin"],
  ],
};

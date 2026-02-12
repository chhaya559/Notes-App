module.exports = function (api) {
  api.cache(true);
  return {
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
      "react-native-reanimated/plugin",
    ],
  };
};

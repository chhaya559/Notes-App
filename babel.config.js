module.exports = {
  presets: ['babel-preset-expo'], // or '@babel/preset-env' etc.
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@utils': './src/utils',
          '@assets': './assets',
          '@theme': './src/theme',
          '@redux': './src/redux',
          '@hooks': './src/hooks',
        },
      },
    ],
  ],
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated worklets support – MUST be last
      'react-native-reanimated/plugin',
    ],
  };
};


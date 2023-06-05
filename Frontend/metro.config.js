// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;
  const { assetExts } = config.resolver;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts.filter((ext) => ext !== 'svg'), 'bin'],
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();

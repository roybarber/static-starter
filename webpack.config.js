module.exports = {
  entry: {
	main: './src/assets/js/main.js'
  },
  output: {
    filename: '[name].js',
    chunkFilename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }],
            ],
          },
        },
      },
    ],
  },
};

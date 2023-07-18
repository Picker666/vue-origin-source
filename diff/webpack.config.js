module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: {
    index: './src/index.js'
  },
  output: {
    path: __dirname + '/public',
    filename: 'js/[name].js'
  },
  devServer: {
  }
}
'use strict'

const path = require('path')

module.exports = env => {
  let mode = 'production'
  let entryFile = './index.jsx'

  if (env && env.development) {
    mode = 'development'
    entryFile = './index-dev.jsx'
  }

  console.log(`mode: ${mode}`)

  return {
    entry: entryFile,
    output: {
      path: path.resolve(__dirname, '..', '..', 'docs'),
      filename: 'bundled.js'
    },
    mode,
    devtool: 'source-map',
    node: {
      __filename: true,
      __dirname: true
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  }
}

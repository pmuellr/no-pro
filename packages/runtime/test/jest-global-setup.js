'use strict'

module.exports = async () => {
  // add shelljs as a global `shell`
  global.shell = require('shelljs')
}

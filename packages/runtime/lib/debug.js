'use strict'

const path = require('path')
const packageJSON = require('../package.json')
const packageName = packageJSON.name

const debug = require('debug')

// thin wrapper over debug to provide file name

module.exports = getDebug

function getDebug (fileName) {
  fileName = getProjectPath(fileName)
  return debug(`${packageName}:${fileName}`)
}

function getProjectPath (fileName) {
  return path.relative(`${__dirname}/../..`, fileName)
}

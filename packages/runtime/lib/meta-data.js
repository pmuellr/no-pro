'use strict'

const debug = require('./debug')(__filename)

// get meta data for a process
module.exports = async function getMetaData () {
  let nodeVersion = process.version
  if (nodeVersion) nodeVersion = nodeVersion.replace(/^v/, '')

  const result = {
    date: new Date().toISOString(),
    title: process.title,
    nodeVersion: nodeVersion,
    arch: process.arch,
    platform: process.platform,
    pid: process.pid,
    execPath: process.execPath,
    mainModule: process.mainModule && process.mainModule.filename
  }

  debug(`getMetaData() returning ${JSON.stringify(result)}`)
  return result
}

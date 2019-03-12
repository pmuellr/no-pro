'use strict'

const crypto = require('crypto')

const debug = require('./debug')(__filename)

// get meta data for a process
module.exports = async function getMetaData () {
  let nodeVersion = process.version
  if (nodeVersion) nodeVersion = nodeVersion.replace(/^v/, '')

  const result = {
    id: getId(),
    date: new Date().toISOString(),
    title: process.title,
    nodeVersion: nodeVersion,
    arch: process.arch,
    platform: process.platform,
    pid: process.pid,
    cwd: process.cwd(),
    execPath: process.execPath,
    mainModule: process.mainModule && process.mainModule.filename
  }

  debug(`getting metadata`)
  return result
}

function getId () {
  return [
    crypto.randomBytes(2).toString('hex'),
    crypto.randomBytes(2).toString('hex'),
    crypto.randomBytes(2).toString('hex'),
    crypto.randomBytes(2).toString('hex')
  ].join('-')
}

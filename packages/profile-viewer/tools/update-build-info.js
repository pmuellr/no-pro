#!/usr/bin/env node

'use strict'

module.exports = main

const fs = require('fs')
const path = require('path')

const projectPath = path.dirname(__dirname)
const rootPath = path.resolve(projectPath, '..', '..')

const version = new Date().toISOString()

if (require.main === module) main()

function main () {
  const buildInfoFile = path.join(projectPath, 'build-info.js')
  console.log(`updating ${path.relative(rootPath, buildInfoFile)} with latest build info`)
  updateFile(
    buildInfoFile,
    /^module\.exports = .*$/,
    `module.exports = '${version}'`
  )
}

function updateFile (fileName, pattern, replacement) {
  let contents = fs.readFileSync(fileName, 'utf8')
  let lines = contents.split(/\n/)

  const results = []
  for (let line of lines) {
    results.push(line.replace(pattern, replacement))
  }

  contents = results.join('\n')
  fs.writeFileSync(fileName, contents)
}

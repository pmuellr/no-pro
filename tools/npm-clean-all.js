#!/usr/bin/env node

'use strict'

// clean all the npm goop, to prep for a clean install

const path = require('path')

const shell = require('shelljs')
const packages = require('./lib/embedded-packages')

const rootDir = path.resolve(path.join(__dirname, '..'))

// build list of files to delete
const filesToDelete = []
filesToDelete.push(`${rootDir}/node_modules`)
filesToDelete.push(`${rootDir}/package-lock.json`)

for (let pkg of packages) {
  const pkgDir = `${rootDir}/packages/${pkg}`
  filesToDelete.push(`${pkgDir}/node_modules`)
  filesToDelete.push(`${pkgDir}/package-lock.json`)
}

console.log(`deleting files:`)
console.log(filesToDelete.join('\n'))

// delete the files
shell.rm('-rf', filesToDelete)

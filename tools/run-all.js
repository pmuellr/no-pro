#!/usr/bin/env node

'use strict'

module.exports = runAll

const runOne = require('./run-one')
const packages = require('./lib/embedded-packages')

async function runAll (command) {
  for (let pkg of packages) {
    console.log(`in package ${pkg} ...`)
    await runOne(pkg, command)
    console.log('')
  }
}

if (require.main === module) main()

async function main () {
  const command = process.argv.slice(2)
  await runAll(command)
}

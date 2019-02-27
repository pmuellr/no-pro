#!/usr/bin/env node

'use strict'

const runOne = require('./run-one')

const [ pkg ] = process.argv.slice(2)
if (pkg == null) {
  console.log('package name (from packages dir) must be the first argument')
  process.exit(1)
}

runOne(pkg, 'npm run -s watch')

#!/usr/bin/env node

// would be nice to have ncu installed as a dev-dep, but
// ... it don't currently work.console
// see: https://github.com/npm/npm/issues/16862

const ncuCommand = 'ncu -u --packageFile package.json'

const shell = require('shelljs')

const runAll = require('./run-all')
const createDeferred = require('./lib/deferred')

async function ncu () {
  const deferred = createDeferred()
  shell.exec(ncuCommand, (code, stdout, stderr) => {
    deferred.resolve({ code, stdout, stderr })
  })

  return deferred.promise
}

async function main () {
  console.log('in root...')
  await ncu()
  console.log('')

  await runAll(ncuCommand)
}

if (require.main === module) main()

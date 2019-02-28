'use strict'

// exposes an async function suitable for profiling

module.exports = someCodeToBeProfiled

const createDeferred = require('../lib/deferred')

async function someCodeToBeProfiled (options = {}) {
  const { verbose = false, count = 5, delay = 10 } = options
  const log = verbose ? consoleLog : () => {}

  log('running with delaySync')
  for (let i = 0; i < count; i++) {
    const value = factorialSync(i, delay)
    log(`${i}!: ${value}`)
  }

  log('')
  log('running with delayAsync')
  for (let i = 0; i < count; i++) {
    const value = await factorialAsync(i, delay)
    log(`${i}!: ${value}`)
  }
}

function factorialSync (n, delay) {
  delaySync(delay)

  if (n <= 0) return 1
  return n * factorialSync(n - 1, delay)
}

async function factorialAsync (n, delay) {
  await delayAsync(delay)

  if (n <= 0) return 1
  return n * await factorialAsync(n - 1, delay)
}

function delaySync (ms) {
  const end = ms + Date.now()
  while (Date.now() < end) {}
  return ms
}

async function delayAsync (ms) {
  const deferred = createDeferred()
  setTimeout(() => deferred.resolve(ms), ms)
  return deferred.promise
}

function consoleLog (...args) {
  console.log(...args)
}

if (require.main === module) {
  someCodeToBeProfiled({
    verbose: true,
    count: 10,
    delay: 100
  })
}

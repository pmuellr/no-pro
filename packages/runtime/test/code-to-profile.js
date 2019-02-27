'use strict'

// exposes an async function suitable for profiling

module.exports = someCodeToBeProfiled

const createDeferred = require('../lib/deferred')

async function someCodeToBeProfiled (options = {}) {
  const { log = false, count = 10 } = options

  if (log) console.log('running with delaySync')
  for (let i = 0; i < count; i++) {
    const value = factorialSync(i)
    if (log) console.log(`${i}!: ${value}`)
  }

  if (log) console.log('')
  if (log) console.log('running with delayAsync')
  for (let i = 0; i < count; i++) {
    const value = await factorialAsync(i)
    if (log) console.log(`${i}!: ${value}`)
  }
}

function factorialSync (n) {
  delaySync(100)

  if (n === 0) return 1
  return n * factorialSync(n - 1)
}

async function factorialAsync (n) {
  await delayAsync(100)

  if (n === 0) return 1
  return n * await factorialAsync(n - 1)
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

if (require.main === module) someCodeToBeProfiled({ log: true })

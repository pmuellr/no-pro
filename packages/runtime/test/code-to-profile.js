'use strict'

// exposes an async function suitable for profiling

module.exports = codeToProfile

const createDeferred = require('../lib/deferred')

const OptVerbose = !!process.env.NO_PRO_CTP_VERBOSE
const OptCount = parseInt(process.env.NO_PRO_CTP_COUNT, 10) || 5
const OptDelay = parseInt(process.env.NO_PRO_CTP_DELAY, 10) || 10

async function main () {
  await codeToProfile()
}

async function codeToProfile (options = {}) {
  const {
    verbose = OptVerbose,
    count = OptCount,
    delay = OptDelay
  } = options

  if (verbose) process.env.DEBUG = '*'

  const debug = require('../lib/debug')(__filename)

  debug('running with delaySync')
  for (let i = 0; i < count; i++) {
    const value = factorialSync(i, delay)
    debug(`${i}!: ${value}`)
  }

  debug('')
  debug('running with delayAsync')
  for (let i = 0; i < count; i++) {
    const value = await factorialAsync(i, delay)
    debug(`${i}!: ${value}`)
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

if (require.main === module) main()

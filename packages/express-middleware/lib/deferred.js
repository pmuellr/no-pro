'use strict'

module.exports = createDeferred

// inline version of https://www.npmjs.com/package/p-defer ; an object
// with .promise, .resolve(), and .reject() properties
function createDeferred () {
  let resolver
  let rejecter

  function resolve (...args) {
    resolver(...args)
  }

  function reject (...args) {
    rejecter(...args)
  }

  const promise = new Promise((resolve, reject) => {
    resolver = resolve
    rejecter = reject
  })

  return { promise, resolve, reject }
}

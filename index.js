'use strict'

// this package is not intended to be used directly, but ...

const packages = require('./tools/lib/embedded-packages')

for (let pkg of packages) {
  exports[pkg] = require(`./packages/${pkg}`)
}

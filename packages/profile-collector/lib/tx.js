'use strict'

module.exports = create

const createDeferred = require('./deferred')

function create (req, res, opts) {
  return new Tx(req, res, opts)
}

class Tx {
  constructor (req, res, opts) {
    this.req = req
    this.res = res
    this.opts = opts
  }

  // writes an object as the response body
  async send (object) {
    const deferred = createDeferred()

    if (object instanceof Error) {
      object = { error: object.message }
    }

    if (typeof object === 'object') {
      object = JSON.stringify(object)
    }

    if (typeof object !== 'string') {
      object = `${object}`
    }

    this.res.statusCode = 200
    this.res.end(object, (err) => {
      if (err) return deferred.reject(err)
      deferred.resolve()
    })

    return deferred.promise
  }
}

if (require.main === module) main()

async function main () {
  const res = {
    end (content, cb) {
      setImmediate(cb)
    }
  }

  const tx = create({}, res)
  console.log('sending')
  await tx.send('foo')
  console.log('sent')
}

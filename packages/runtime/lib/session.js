'use strict'

module.exports = create

let inspector = null
try {
  inspector = require('inspector')
} catch (err) {
  // inspector will be null :-(
}

const createDeferred = require('./deferred')

async function create () {
  if (inspector == null) {
    throw new Error('the inspector module is not available for this version of node')
  }

  let session = null
  try {
    session = new inspector.Session()
  } catch (err) {
    throw new Error(`error creating inspector session: ${err.message}`)
  }

  try {
    session.connect()
  } catch (err) {
    throw new Error(`error connecting inspector session: ${err.message}`)
  }

  return new Session(session)
}

class Session {
  constructor (session) {
    this._session = session
  }

  async destroy () {
    this._session.disconnect()
    this._session = null
  }

  async post (method, args) {
    if (this._session == null) {
      throw new Error('session disconnected')
    }

    const deferred = createDeferred()

    this._session.post(method, args, (err, response) => {
      if (err) return deferred.reject(err)
      deferred.resolve(response)
    })

    return deferred.promise
  }
}

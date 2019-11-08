'use strict'

module.exports = create

const debug = require('./debug')(__filename)

let inspector = null
try {
  inspector = require('inspector')
} catch (err) {
  // inspector will be null :-(
  debug('inspector module not available')
}

const createDeferred = require('./deferred')

/**
 * @returns Promise<Session>
 */
async function create () {
  debug('creating session')

  if (inspector == null) {
    throw new Error('the inspector module is not available for this version of node')
  }

  let session = null
  try {
    session = new inspector.Session()
  } catch (err) {
    debug(`error creating session: ${err.message}`)
    throw new Error(`error creating inspector session: ${err.message}`)
  }

  try {
    session.connect()
  } catch (err) {
    debug(`error connecting to session: ${err.message}`)
    throw new Error(`error connecting inspector session: ${err.message}`)
  }

  return new Session(session)
}

class Session {
  constructor (session) {
    this._session = session
  }

  async destroy () {
    debug(`destroying session`)
    this._session.disconnect()
    this._session = null
  }

  /**
   * @param {string} method
   * @param {*}      [args]
   *
   * @returns {Promise<*>}
   */
  async post (method, args) {
    debug(`posting method ${method} ${JSON.stringify(args)}`)
    if (this._session == null) {
      throw new Error('session disconnected')
    }

    const deferred = createDeferred()

    this._session.post(method, args, (err, response) => {
      if (err) {
        debug(`error from method ${method}: ${err.message}`)
        return deferred.reject(err)
      }
      deferred.resolve(response)
    })

    return deferred.promise
  }
}

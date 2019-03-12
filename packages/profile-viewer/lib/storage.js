'use strict'

// wrappers over localStorage and indexedDB

module.exports = {
  idb,
  localStorage
}

const idbKeyval = require('idb-keyval')

function idb ({ database, objectStore }) {
  return new Idb({ database, objectStore })
}

function localStorage ({ prefix }) {
  return new LocalStorage({ prefix })
}

class LocalStorage {
  super ({ prefix } = {}) {
    if (!prefix) throw new Error('prefix required')

    this._prefix = prefix
  }

  ls () {
    throw new Error('not yet supported')
  }

  get (key) {
    key = `${this._prefix}-${key}`
    return window.localStorage.getItem(key)
  }

  set (key, val) {
    key = `${this._prefix}-${key}`
    return window.localStorage.setItem(key, val)
  }

  del (key) {
    key = `${this._prefix}-${key}`
    return window.localStorage.removeItem(key)
  }
}

class Idb {
  super ({ database, objectStore } = {}) {
    if (!database) throw new Error('database required')
    if (!objectStore) throw new Error('objectStore required')

    this._store = new idbKeyval.Store(database, objectStore)
  }

  async ls () {
    return idbKeyval.keys(this._store)
  }

  async get (key) {
    return idbKeyval.get(key, this._store)
  }

  async set (key, val) {
    return idbKeyval.set(key, val, this._store)
  }

  async del (key) {
    return idbKeyval.det(key, this._store)
  }
}

'use strict'

exports.create = create

// Observable Objects are objects which contain properties for which you can
// observe changes.
//
// To create an ObservableObject, use:
//     observableObject = ObservableObject.create({key1: val1, key2: val2})
//
// To set values of properties in an ObservableObject, use
//     observableObject.set({key1: val1, key2: val2})
//
// To get values of properties in an ObservableObject, use
//     observableObject.get()
//     observableObject.get({key1: defVal1, key2: devVal2})
//
// The first form returns all the properties in a new object.  The second
// form returns the object passed in, with any requested properties values
// reset, if they are in the observable object.
//
// To be notified of changes to properties of an ObservableObject, use
//     observableObject.on({key1: fn(newV, oldV), key2: fn(newV, oldV)})
//
// The notification functions will be passed the new and old values.
// The `.on()` method returns a function which stops the notifications set.

const EventEmitter = require('events')

// const debug = require('./debug')(__filename)

function create (values) {
  if (values == null) throw new Error('argument expected with the valid properties and initial values')
  if (Object.keys(values).length === 0) throw new Error('argument has no properties')

  return new ObservableObject(values)
}

class ObservableObject {
  constructor (values) {
    this._validProps = new Set(Object.keys(values))
    this._props = Object.assign({}, values)
    this._events = new EventEmitter()
  }

  // get the values of the properties
  get (values) {
    // no args, return shallow copy of state
    if (values == null) {
      const result = Object.assign({}, this._props)
      // debug(`get(${JSON.stringify(values)}: ${JSON.stringify(result)})`)
      return result
    }

    // otherwise, fill in values for the object passed in
    const resultValues = Object.assign({}, values)

    for (let key in resultValues) {
      this._validateProp(key)
      if (this._props.hasOwnProperty(key)) {
        resultValues[key] = this._props[key]
      }
    }

    // debug(`get(${JSON.stringify(values)}: ${JSON.stringify(resultValues)})`)
    return resultValues
  }

  // get the value for a single property
  getSingle (prop) {
    this._validateProp(prop)
    const result = this._props[prop]

    // debug(`getSingle(${prop}: ${JSON.stringify(result)})`)

    return result
  }

  // set the values of the properties
  set (values) {
    // debug(`set(${JSON.stringify(values)})`)
    const oldValues = new Map()

    for (let key in values) {
      this._validateProp(key)
      if (this._props[key] === values[key]) continue

      oldValues.set(key, this._props[key])
      this._props[key] = values[key]
    }

    for (let key of oldValues.keys()) {
      // debug(`set(): emitting change for ${key}: ${JSON.stringify(values[key])}`)
      this._events.emit(key, values[key], oldValues.get(key))
    }
  }

  // set handlers for property changes
  on (handlers) {
    // debug(`on(${Object.keys(handlers).join(',')})`)
    const events = this._events

    handlers = Object.assign({}, handlers)

    for (let key in handlers) {
      events.on(key, handlers[key])
    }

    return function revoker () {
      // debug(`off(${Object.keys(handlers).join(',')})`)
      for (let key in handlers) {
        events.off(key, handlers[key])
      }
    }
  }

  _validateProp (key) {
    if (this._validProps.has(key)) return

    const validKeys = Array.from(this._validProps).join('", "')
    const message = `invalid key: "${key}"; valid keys are: "${validKeys}"`
    throw new Error(message)
  }
}

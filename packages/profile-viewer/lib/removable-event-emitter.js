'use strict'

const EventEmitter = require('events')

// A subclass of EventEmitter that adds the following methods:
// * removableOn()     (like on())
// * removableOnce()   (like once())
//
// The difference with these methods and their analogues is that the return
// value is a function that will remove the listener, instead of returning the
// eventEmitter instance.
//
// eg:
//   const removeListener = thing.removableOn('foo', () => { ... })
//   ...
//   removeListener() // remove the listener from the event

export default class RemovableEventEmitter extends EventEmitter {
  removableOn (eventName, listener) {
    this.on(eventName, listener)

    return () => {
      this.removeListener(eventName, listener)
    }
  }

  removableOnce (eventName, listener) {
    this.once(eventName, listener)

    return () => {
      this.removeListener(eventName, listener)
    }
  }
}

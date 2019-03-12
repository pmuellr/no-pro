'use strict'

module.exports = {
  createPkg,
  createMod,
  createFn,
  createHotSpot
}

function createPkg (id, props) { return new Pkg(id, props) }
function createMod (id, props) { return new Mod(id, props) }
function createFn (id, props) { return new Fn(id, props) }
function createHotSpot (id, props) { return new HotSpot(id, props) }

class ProfileEntry {
  constructor (id, props) {
    this._id = id
    this._calls = new Set()
    this._calledBy = new Set()
    this._time = 0

    for (let prop in props) {
      this[prop] = props[prop]
    }
  }

  // read-only properties
  get id () { return this._id }
  get calls () { return this._calls }
  get calledBy () { return this._calledBy }
  get time () { return this._time }
  get isPackage () { return false }
  get isModule () { return false }
  get isFunction () { return false }
  get type () {
    if (this.isPackage) return 'package'
    if (this.isModule) return 'module'
    if (this.isPackage) return 'function'
    return 'unknown'
  }

  // methods used when building data structures
  addCalls (entry) {
    this._calls.add(entry)
    entry._calledBy.add(this)
  }

  addTime (time) {
    this._time += time
  }

  toString () {
    return `${this.constructor.name}[id: ${this.id}]`
  }

  dump () {
    console.log(this.id)
    console.log(`    time: ${this.time}`)

    for (let prop in this) {
      if (prop.startsWith('_')) continue
      if (prop === 'source') {
        const source = this.source.split('\n')[0]
        console.log(`    source: ${source}`)
        continue
      }

      const value = this[prop]
      if (value instanceof Set) {
        console.log(`    ${prop}:`)
        for (let entry of value) {
          console.log(`        ${entry.id}`)
        }
        continue
      }

      console.log(`    ${prop}: ${this[prop]}`)
    }

    console.log(`    calls`)
    for (let entry of this._calls) {
      console.log(`        ${entry.id}`)
    }

    console.log(`    calledBy`)
    for (let entry of this._calledBy) {
      console.log(`        ${entry.id}`)
    }
  }
}

class Pkg extends ProfileEntry {
  get isPackage () { return true }
}

class Mod extends ProfileEntry {
  get isModule () { return true }
}

class Fn extends ProfileEntry {
  get isFunction () { return true }
}

class HotSpot {
  constructor ({ line }) {
    this._line = line
    this._time = 0
  }

  addTime (time) {
    this._time += time
  }

  toString () {
    return `${this.constructor.name}[line: ${this._line}, time: ${this._time}]`
  }
}

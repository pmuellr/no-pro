'use strict'

// Exports a Store object which maintains the app state.
// You should generally use the `useListener()` and `useAccessors()` methods
// to get, set, and listen for changes to property values.

const { useState, useEffect } = require('react')

// const debug = require('./debug')(__filename)
const ObservableObject = require('./observable-object')

// valid props to use with the store
const StoreProps = {
  currentPage: 'main',
  pageSubtitle: '',
  profileInfo: null,
  pkgIdSelected: null,
  modIdSelected: null,
  fnIdSelected: null,
  entrySelected: null,
  scrollRefPackages: null,
  scrollRefModules: null,
  scrollRefFunctions: null,
  scrollRefContent: null
}

// create the exported object
const Store = ObservableObject.create(StoreProps)

// react hook to return a value of a prop as it changes
Store.useProp = function storeUseProp (prop) {
  // debug(`useProp(${prop})`)
  const [ propValue, setPropValue ] = useState(() => {
    const result = Store.getSingle(prop)
    // debug(`useProp(): initializing useState(${prop}: ${JSON.stringify(result)})`)
    return result
  })

  useEffect(() => {
    const revoker = Store.on({ [prop]: newValue => {
      // debug(`useProp(): propChanged(${prop}: ${JSON.stringify(newValue)})`)
      setPropValue(newValue)
    } })

    // initialize value first time, may have changed since effect installed
    setPropValue(Store.getSingle(prop))

    return revoker
  })

  return propValue
}

// set some invariants

// when any package / module / fn is selected in the top pane,
// clear the entrySelected entry (overrides what's shown in content)
function resetEntrySelected () { Store.set({ entrySelected: null }) }

Store.on({
  pkgIdSelected: resetEntrySelected,
  modIdSelected: resetEntrySelected,
  fnIdSelected: resetEntrySelected
})

module.exports = Store

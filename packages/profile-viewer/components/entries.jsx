'use strict'

import React from 'react'
import styled from 'styled-components'

const Store = require('../lib/store.js')
const formatTime = require('../lib/formatTime')

const debug = require('../lib/debug')(__filename)

export default function Entries (props) {
  debug(`rendering ${props.prop} Entries`)

  const { profileInfo, prop, idSelectedKey, pkgId, modId } = props
  const selectedKey = Store.useProp(idSelectedKey)

  return (
    <StyledEntries>
      {getEntries(profileInfo, prop, selectedKey, setSelectedKey, pkgId, modId)}
    </StyledEntries>
  )

  function setSelectedKey (value) {
    Store.set({ [idSelectedKey]: value })

    if (idSelectedKey === 'pkgIdSelected') {
      Store.set({ modIdSelected: null, fnIdSelected: null })
      scrollRefToTop(Store.getSingle('scrollRefModules'))
      scrollRefToTop(Store.getSingle('scrollRefFunctions'))
      scrollRefToTop(Store.getSingle('scrollRefContent'))
    }

    if (idSelectedKey === 'modIdSelected') {
      Store.set({ fnIdSelected: null })
      scrollRefToTop(Store.getSingle('scrollRefFunctions'))
      scrollRefToTop(Store.getSingle('scrollRefContent'))
    }

    if (idSelectedKey === 'fnIdSelected') {
      scrollRefToTop(Store.getSingle('scrollRefContent'))
    }
  }
}

function scrollRefToTop (ref) {
  const element = ref.current
  if (element == null) return

  element.scrollTop = 0
  element.scrollLeft = 0
}

const StyledEntries = styled.div`
`

function getEntries (profileInfo, prop, selectedKey, setSelectedKey, pkgId, modId) {
  let entries = profileInfo[prop]

  entries = Array
    .from(profileInfo[prop])
    .filter(entry => entry.time > 100)
    .filter(entry => pkgMatches(entry, pkgId))
    .filter(entry => modMatches(entry, modId))
    .sort((entryA, entryB) => entryB.time - entryA.time)

  return entries.map(entry => {
    const id = entry.id
    const name = entry.name
    const time = formatTime(entry.time)

    return (
      <Entry
        key={id}
        entryKey={id}
        name={name}
        time={time}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
      />
    )
  })
}

function pkgMatches (entry, pkgId) {
  if (pkgId == null) return true
  return entry.pkg.id === pkgId
}

function modMatches (entry, modId) {
  if (modId == null) return true
  return entry.mod.id === modId
}

function Entry (props) {
  const { entryKey, name, time, selectedKey, setSelectedKey } = props
  const isSelected = entryKey === selectedKey

  return (
    <StyledEntry key={entryKey} onClick={select} selected={isSelected}>
      <EntryTime> {time} </EntryTime>
      <EntryName> {name} </EntryName>
    </StyledEntry>
  )

  function select () {
    if (!isSelected) {
      setSelectedKey(entryKey)
    } else {
      setSelectedKey(null)
    }
  }
}

const StyledEntry = styled.div`
  cursor:           pointer;
  color:            ${getSelectedForeground};
  background-color: ${getSelectedBackground};
`

function getSelectedForeground (props) {
  if (props.selected) return '#DD0'
  return 'inherit'
}

function getSelectedBackground (props) {
  if (props.selected) return '#777'
  return 'inherit'
}

function EntryName (props) {
  const title = props.children.map(child => `${child}`).join('')
  return <StyledEntryName title={title}>{props.children}</StyledEntryName>
}

const StyledEntryName = styled.div`
  display:        inline-block;
  vertical-align: bottom;
  width:          calc(100% - 5em);
  user-select:    none;
  overflow:       hidden;
  padding-left:   1em;
  white-space:    nowrap;
  text-overflow:  ellipsis;
`

const EntryTime = styled.div`
  display:        inline-block;
  vertical-align: bottom;
  width:          5em;
  user-select:    none;
  overflow:       hidden;
  text-align:     right;
  font-style:     italic;
  font-size:      80%;
  padding-right:  0.2em;  
`

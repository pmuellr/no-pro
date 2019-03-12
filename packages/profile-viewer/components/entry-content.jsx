'use strict'

import React from 'react'
import styled from 'styled-components'

import ToolBarIcon from './tool-bar-icon.jsx'

const Store = require('../lib/store.js')
const formatTime = require('../lib/formatTime')

const debug = require('../lib/debug')(__filename)

export default function EntryContent (props) {
  debug('rendering EntryContent')

  const { profileInfo, setContentTitle } = props

  const entrySelected = Store.useProp('entrySelected')
  let pkgId = Store.useProp('pkgIdSelected')
  let modId = Store.useProp('modIdSelected')
  let fnId = Store.useProp('fnIdSelected')

  if (entrySelected != null) {
    pkgId = null
    modId = null
    fnId = null

    if (entrySelected.isPackage) pkgId = entrySelected.id
    if (entrySelected.isModule) modId = entrySelected.id
    if (entrySelected.isFunction) fnId = entrySelected.id
  }

  if (fnId != null) {
    return <FunctionContent
      id={fnId}
      profileInfo={profileInfo}
      setContentTitle={setContentTitle}
    />
  }

  if (modId != null) {
    return <ModuleContent
      id={modId}
      profileInfo={profileInfo}
      setContentTitle={setContentTitle}
    />
  }

  if (pkgId != null) {
    return <PackageContent
      id={pkgId}
      profileInfo={profileInfo}
      setContentTitle={setContentTitle}
    />
  }

  if (profileInfo != null) {
    return <ProfileContent
      profileInfo={profileInfo}
      setContentTitle={setContentTitle}
    />
  }

  setContentTitle('')
  return <EmptyContent />
}

function FunctionContent (props) {
  debug('rendering FunctionContent')

  const { id, profileInfo, setContentTitle } = props
  const fn = profileInfo.functionById(id)
  const name = fn.name

  setContentTitle(`function ${name}`)
  return <EntryContentList entry={fn} />
}

function ModuleContent (props) {
  debug('rendering ModuleContent')

  const { id, profileInfo, setContentTitle } = props
  const mod = profileInfo.moduleById(id)
  const name = mod.name

  setContentTitle(`module ${name}`)
  return <EntryContentList entry={mod} />
}

function PackageContent (props) {
  debug('rendering PackageContent')

  const { id, profileInfo, setContentTitle } = props
  const pkg = profileInfo.packageById(id)
  const name = pkg.name

  setContentTitle(`package ${name}`)
  return <EntryContentList entry={pkg} />
}

function EntryContentList (props) {
  debug('rendering EntryContent')

  const { entry } = props

  return <table style={{ width: '100%' }}>
    <tbody>
      <EntryList title='in package' entries={[entry.pkg]} />
      <EntryList title='in module' entries={[entry.mod]} />
      <EntryList title='calls' entries={entry.calls} />
      <EntryList title='called by' entries={entry.calledBy} />
      <EntryList title='contains modules' entries={entry.mods} />
      <EntryList title='contains functions' entries={entry.fns} />
    </tbody>
  </table>
}

function EntryList (props) {
  debug('rendering EntryList')

  let { title, entries } = props
  if (entries == null) return null

  entries = Array
    .from(entries)
    .filter(entry => entry != null)
    .sort((entryA, entryB) => entryB.time - entryA.time)

  if (entries.length === 0) return null

  const rows = []
  rows.push(<tr key={title}>
    <td colSpan='2' style={{ paddingTop: '1em' }}><b>{title}</b></td>
  </tr>)

  for (let entry of entries) {
    rows.push(<tr key={entry.id}>
      <StyledEntryTime>{formatTime(entry.time)}</StyledEntryTime>
      <EntryName entry={entry} />
    </tr>)
  }

  return rows
}

const StyledEntryTime = styled.td`
  vertical-align: bottom;
  width:          5em;
  overflow:       hidden;
  text-align:     right;
  font-style:     italic;
  font-size:      80%;
  padding-right:  0.2em;  
  white-space:    nowrap;
`

function EntryName (props) {
  debug('rendering EntryName')

  const { entry } = props

  return <StyledEntryName title={entry.name} onClick={onClick}>
    {entry.name}
  </StyledEntryName>

  function onClick () {
    Store.set({ entrySelected: entry })

    const ref = Store.getSingle('scrollRefContent')
    const element = ref.current
    if (element != null) {
      element.scrollTop = 0
      element.scrollLeft = 0
    }
  }
}

const StyledEntryName = styled.td`
  vertical-align: bottom;
  width:          calc(100% - 5em);
  overflow:       hidden;
  padding-left:   1em;
  white-space:    nowrap;
  text-overflow:  ellipsis;
  color:          #33F;
  cursor:         default;
`

function ProfileContent (props) {
  debug('rendering ProfileContent')

  const { profileInfo, setContentTitle } = props

  setContentTitle('profile info')

  const time = Math.round(profileInfo.time / 1000) / 1000

  const basicInfo = {
    time: `${time} seconds`,
    packages: profileInfo.packages.size,
    modules: profileInfo.modules.size,
    functions: profileInfo.functions.size
  }

  return <StyledProfileContent>
    <ProfileTableContent title='profile data' data={basicInfo} />
    <ProfileTableContent title='meta data' data={profileInfo.metaData} />
  </StyledProfileContent>
}

const StyledProfileContent = styled.div`
`

function ProfileTableContent (props) {
  debug('rendering ProfileTableContent')

  const { title, data } = props

  if (data == null) return null

  const tableEntries = []
  for (let key in data) {
    tableEntries.push(<tr key={key}>
      <td><b>{key}:</b></td>
      <td>{data[key]}</td>
    </tr>)
  }

  return <div>
    <h3>{title}</h3>
    <div style={{ paddingLeft: '1em' }}>
      <table>
        <tbody>
          {tableEntries}
        </tbody>
      </table>
    </div>
  </div>
}

function EmptyContent (props) {
  debug('rendering EmptyContent')

  return (
    <div>
      <p>
        This app displays aggregate data from a V8 CPU profile file.
      </p>

      <p>
        To load a profile, click the toolbar icon
        &nbsp;<ToolBarIcon title='upload a profile' icon='add_box' />&nbsp;
        at the top / right of the page to select a file.
      </p>

      <p>
        Or, you can drop a profile file anywhere in this window.
      </p>

      <p>
        Only files named <tt>.cpuprofile</tt> can be loaded.
      </p>

      <p>
        You can download a sample profile here:
        <a href='profiles/extras-verbose.cpuprofile' download>extras-verbose.cpuprofile</a>
      </p>

      <p>
        For help with this app, click the toolbar icon
        &nbsp;<ToolBarIcon title='help' icon='help' />&nbsp;
        at the top / right of the page.
      </p>
    </div>
  )
}

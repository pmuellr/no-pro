'use strict'

import React, { useState, useRef } from 'react'
import styled from 'styled-components'

import Pane from '../browser-pane.jsx'
import Entries from '../entries.jsx'
import EntryContent from '../entry-content.jsx'
import Browser from '../browser.jsx'

const Store = require('../../lib/store.js')

const debug = require('../../lib/debug')(__filename)

export default function MainPage (props) {
  debug('rendering MainPage')

  const [contentTitle, setContentTitle] = useState(null)
  const profileInfo = Store.useProp('profileInfo')

  let pageSubtitle = 'profile viewer'

  if (profileInfo != null) {
    if (profileInfo.fileName != null) {
      pageSubtitle = profileInfo.fileName
    } else if (profileInfo.metaData != null) {
      pageSubtitle = profileInfo.metaData.mainModule
    } else {
      pageSubtitle = 'unnamed profile'
    }
  }

  Store.set({ pageSubtitle })

  const scrollRefPackages = useRef()
  const scrollRefModules = useRef()
  const scrollRefFunctions = useRef()
  const scrollRefContent = useRef()

  Store.set({
    scrollRefPackages,
    scrollRefModules,
    scrollRefFunctions,
    scrollRefContent
  })

  return (
    <Browser>
      <Pane title='packages' scrollRef={scrollRefPackages}>
        <ListPackages profileInfo={profileInfo} />
      </Pane>

      <Pane title='modules' scrollRef={scrollRefModules}>
        <ListModules profileInfo={profileInfo} />
      </Pane>

      <Pane title='functions' scrollRef={scrollRefFunctions}>
        <ListFunctions profileInfo={profileInfo} />
      </Pane>

      <Pane title={contentTitle} scrollRef={scrollRefContent}>
        <EntryContent profileInfo={profileInfo} setContentTitle={setContentTitle} />
      </Pane>
    </Browser>
  )
}

function ListPackages (props) {
  debug('rendering ListPackages')

  const { profileInfo } = props

  if (profileInfo == null) return <EmptyPane>no packages loaded</EmptyPane>

  return (
    <Entries
      prop='packages'
      profileInfo={profileInfo}
      idSelectedKey='pkgIdSelected'
    />
  )
}

function ListModules (props) {
  debug('rendering ListModules')

  const { profileInfo } = props
  const pkgSelected = Store.useProp('pkgIdSelected')

  if (profileInfo == null) return <EmptyPane>no modules loaded</EmptyPane>

  return (
    <Entries
      prop='modules'
      profileInfo={profileInfo}
      idSelectedKey='modIdSelected'
      pkgId={pkgSelected}
    />
  )
}

function ListFunctions (props) {
  debug('rendering ListFunctions')

  const { profileInfo } = props
  const pkgSelected = Store.useProp('pkgIdSelected')
  const modSelected = Store.useProp('modIdSelected')

  if (profileInfo == null) return <EmptyPane>no functions loaded</EmptyPane>

  return (
    <Entries
      prop='functions'
      profileInfo={profileInfo}
      idSelectedKey='fnIdSelected'
      pkgId={pkgSelected}
      modId={modSelected}
    />
  )
}

function EmptyPane (props) {
  debug('rendering Content')

  return (
    <StyledEmptyPane>{props.children}</StyledEmptyPane>
  )
}

const StyledEmptyPane = styled.div`
  text-align: center;
  vertical-align: center;
  padding-top: 4em;
`

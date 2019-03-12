'use strict'

import React from 'react'
import styled from 'styled-components'

import MainPage from './pages/main.jsx'
import HelpPage from './pages/help.jsx'
import AboutPage from './pages/about.jsx'

import ToolBarIcon from './tool-bar-icon.jsx'

const Store = require('../lib/store')
const ProfileLoader = require('../lib/profile-loader')

const debug = require('../lib/debug')(__filename)

export default function App (props) {
  debug('rendering App')

  const pageSubtitle = Store.useProp('pageSubtitle')
  debug(`pageSubtitle: ${pageSubtitle}`)

  return (
    <StyledApp onDragOver={onDragOver} onDrop={onDrop}>
      <AppHeader subtitle={pageSubtitle} />
      <CurrentPage />
    </StyledApp>
  )

  function onDragOver (event) {
    event.preventDefault()
  }

  async function onDrop (event) {
    event.stopPropagation()
    event.preventDefault()

    const dataTransfer = event.dataTransfer
    if (dataTransfer == null) return

    const file = dataTransfer.files[0]
    if (file == null) {
      window.alert(`object dropped was not a file`)
      return
    }

    try {
      await ProfileLoader.loadFromFile(file)
    } catch (err) {
      window.alert(`error with dropped file: ${err.message}`)
    }
  }
}

const StyledApp = styled.div`
  display: grid;
  width:   100%;
  height:  100%;
  grid-template-rows:    auto minmax(90%, 95%);
  grid-template-columns: 100%;
  grid-template-areas:
    "app-header"
    "app-page"
  ;
`

function AppHeader (props) {
  debug('rendering AppHeader')

  return (
    <StyledAppHeader>
      <Title subtitle={props.subtitle} />
      <ToolBar />
    </StyledAppHeader>
  )
}

const StyledAppHeader = styled.div`
  grid-area:     app-header;
  display:       grid;
  width:         100%;
  height:        100%;
  border-bottom: thin solid #AAA;
  padding-bottom: 0.2em;

  grid-template-rows:    100%;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "app-header-title app-header-toolbar"
  ;
`

function Title (props) {
  debug('rendering Title')

  return (
    <StyledTitle>
      <h3 style={{ margin: 0 }}>no-pro:
        <span> {props.subtitle}</span>
      </h3>
    </StyledTitle>
  )
}

const StyledTitle = styled.div`
  grid-area: app-header-title;
`

function ToolBar (props) {
  debug('rendering ToolBar')

  return (
    <React.Fragment>
      <StyledToolBar>
        <ToolBarIcon loadFile={loadFile} title='upload a profile' icon='add_box' />
        <ToolBarIcon page='main' title='main page' icon='dashboard' />
        <ToolBarIcon page='help' title='help' icon='help' />
        <ToolBarIcon page='about' title='about' icon='info' />
      </StyledToolBar>
      <input
        id='file-upload'
        type='file'
        accept='.cpuprofile'
        onChange={loadFile}
        style={{ display: 'none' }}
      />
    </React.Fragment>
  )

  async function loadFile (event) {
    const el = event.target
    if (el == null) return

    const file = el.files[0]
    if (el == null) return

    try {
      await ProfileLoader.loadFromFile(file)
    } catch (err) {
      window.alert(`error with dropped file: ${err.message}`)
    }

    el.value = ''
  }
}

const StyledToolBar = styled.div`
  grid-area: app-header-toolbar;
`

function CurrentPage (props) {
  debug('rendering CurrentPage')

  const currentPage = Store.useProp('currentPage')

  return (
    <StyledCurrentPage>
      {getPageContents(currentPage)}
    </StyledCurrentPage>
  )
}

const StyledCurrentPage = styled.div`
  grid-area: app-page;
`

function getPageContents (name) {
  if (name === 'main') return <MainPage />
  if (name === 'about') return <AboutPage subtitle='about' />
  return <HelpPage subtitle='about' />
}

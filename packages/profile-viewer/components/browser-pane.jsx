'use strict'

import React from 'react'
import styled from 'styled-components'

const debug = require('../lib/debug')(__filename)

export default function Pane (props) {
  debug('rendering Pane')

  const { scrollRef } = props

  return (
    <PaneContainer>
      <PaneHeader title={props.title} />
      <PaneBody scrollRef={scrollRef}>
        {props.children}
      </PaneBody>
    </PaneContainer>
  )
}

function PaneContainer (props) {
  debug('rendering PaneContainer')

  return (
    <StyledPaneContainer>
      {props.children}
    </StyledPaneContainer>
  )
}

const StyledPaneContainer = styled.div`
  display: grid;
  width:   100%;
  height:  100%;
  grid-template-rows:    auto 1fr;
  grid-template-columns: 100%;
  grid-template-areas:
    "pane-header"
    "pane-content"
  ;
  background-color: #EEE;
  border-radius: 0.5em 0.5em 0.5em 0.5em;
  min-height: 0;
`

function PaneHeader (props) {
  debug('rendering PaneHeader')

  let title = props.title
  if (title == null || title === '') title = <span>&nbsp;</span>
  return (
    <StyledPaneHeader>
      {title}
    </StyledPaneHeader>
  )
}

const StyledPaneHeader = styled.div`
  grid-area: pane-header;
  font-weight: bold;
  background-color: #DDD;
  padding: 0.2em;
  padding-left: 0.5em;
  border-radius: 0.5em 0.5em 0 0;
`

function PaneBody (props) {
  debug('rendering PaneBody')

  const { scrollRef } = props
  return (
    <StyledPaneBody ref={scrollRef}>
      {props.children}
    </StyledPaneBody>
  )
}

const StyledPaneBody = styled.div`
  grid-area: pane-content;
  padding: 0.2em;
  overflow-y: scroll;
  min-height: 0;
`

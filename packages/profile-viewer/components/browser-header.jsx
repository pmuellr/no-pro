'use strict'

import React from 'react'
import styled from 'styled-components'

const debug = require('../lib/debug')(__filename)

export default function BrowserHeader (props) {
  debug('rendering BrowserHeader')

  return (
    <HeaderContainer>
      <Header title={props.title} />
      <HeaderBody>
        {props.children}
      </HeaderBody>
    </HeaderContainer>
  )
}

function HeaderContainer (props) {
  debug('rendering HeaderContainer')

  return (
    <StyledHeaderContainer>
      {props.children}
    </StyledHeaderContainer>
  )
}

const StyledHeaderContainer = styled.div`
  display: grid;
  width:   100%;
  height:  100%;
  grid-template-rows:    auto 1fr;
  grid-template-columns: 100%;
  grid-template-areas:
    "Header-header"
    "Header-content"
  ;
  background-color: #EEE;
  border-radius: 0.5em 0.5em 0.5em 0.5em;
  min-height: 0;
`

function Header (props) {
  debug('rendering Header')

  let title = props.title
  if (title == null || title === '') title = <span>&nbsp;</span>
  return (
    <StyledHeaderHeader>
      {title}
    </StyledHeaderHeader>
  )
}

const StyledHeaderHeader = styled.div`
  grid-area: Header-header;
  font-weight: bold;
  background-color: #DDD;
  padding: 0.2em;
  padding-left: 0.5em;
  border-radius: 0.5em 0.5em 0 0;
`

function HeaderBody (props) {
  debug('rendering HeaderBody')

  return (
    <StyledHeaderBody>
      {props.children}
    </StyledHeaderBody>
  )
}

const StyledHeaderBody = styled.div`
  grid-area: Header-content;
  padding: 0.2em;
  overflow-y: scroll;
  min-height: 0;
`

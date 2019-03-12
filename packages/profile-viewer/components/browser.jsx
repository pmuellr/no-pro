'use strict'

import React from 'react'

import styled from 'styled-components'

const debug = require('../lib/debug')(__filename)

export default function Browser (props) {
  debug('rendering Browser')

  const children = props.children
  const navA = children[0]
  const navB = children[1]
  const navC = children[2]
  const content = children[3]
  return (
    <BrowserContainer>
      <BrowserPane pane='navA'> {navA} </BrowserPane>
      <BrowserPane pane='navB'> {navB} </BrowserPane>
      <BrowserPane pane='navC'> {navC} </BrowserPane>
      <BrowserPane pane='content'> {content} </BrowserPane>
    </BrowserContainer>
  )
}

function BrowserContainer (props) {
  debug('rendering BrowserContainer')

  return (
    <StyledBrowserContainer>
      {props.children}
    </StyledBrowserContainer>
  )
}

const StyledBrowserContainer = styled.div`
  display: grid;
  width:   100%;
  height:  100%;
  grid-template-rows:    auto minmax(40%, 50%) minmax(40%, 50%);
  grid-template-columns: 33.3% 33.3% 33.3%;
  grid-template-areas:
    "browser-header  browser-header  browser-header"
    "browser-navA    browser-navB    browser-navC"
    "browser-content browser-content browser-content"
  ;
`

function BrowserPane (props) {
  debug('rendering BrowserPane')
  return (
    <StyledBrowserPane pane={props.pane}>
      {props.children}
    </StyledBrowserPane>
  )
}

const StyledBrowserPane = styled.div`
  grid-area: ${props => `browser-${props.pane}`};
  margin: 0.25em;
`

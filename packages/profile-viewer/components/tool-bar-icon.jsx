'use strict'

import React from 'react'

import styled from 'styled-components'

const Store = require('../lib/store.js')

const debug = require('../lib/debug')(__filename)

export default function ToolBarIcon (props) {
  debug('rendering ToolBarIcon')

  const { title, icon, page, loadFile } = props
  const style = {
    verticalAlign: 'bottom'
  }

  if (loadFile != null) {
    return (
      <StyledButton title={title}>
        <label htmlFor='file-upload'>
          <i style={style} className='material-icons md-18'>{icon}</i>
        </label>
        <input
          id='file-upload'
          type='file'
          accept='.cpuprofile'
          onChange={loadFile}
          style={{ display: 'none' }}
        />
      </StyledButton>
    )
  }

  return (
    <StyledButton title={title} onClick={handleClick}>
      <i style={style} className='material-icons md-18'>{icon}</i>
    </StyledButton>
  )

  function handleClick () {
    if (page == null) return
    Store.set({ currentPage: page })
  }
}

const StyledButton = styled.button`
  vertical-align: bottom;
  padding: 2px;
  margin: 1px 2px;
  border-radius: 8px;
  border: thin solid #777;
`

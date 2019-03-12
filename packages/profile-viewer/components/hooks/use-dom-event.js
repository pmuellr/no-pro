'use strict'

// react hook for dom event handlers that removes the handler when no longer needed

import { useEffect, useDebugValue } from 'react'

export default function useDomEvent (eventSource, eventName, eventArgs, eventHandler) {
  // eventArgs is optional
  if (typeof eventArgs === 'function' && eventHandler == null) {
    eventHandler = eventArgs
    eventArgs = undefined
  }

  useDebugValue(({ eventSource, eventName }) => `useDomEvent(${eventSource}, ${eventName})`)

  useEffect(() => {
    eventSource.addEventListener(eventName, eventHandler, eventArgs)

    return () => {
      eventSource.removeEventListener(eventName, eventHandler, eventArgs)
    }
  })
}

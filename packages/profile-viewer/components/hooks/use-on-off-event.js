'use strict'

// react hook for node event listeners that removes the listener when no longer needed

import { useEffect, useDebugValue } from 'react'

export default function useNodeEvent (eventSource, eventName, eventHandler) {
  useDebugValue(({ eventSource, eventName }) => `useNodeEvent(${eventSource}, ${eventName})`)

  useEffect(() => {
    eventSource.on(eventName, eventHandler)

    return () => {
      eventSource.off(eventName, eventHandler)
    }
  })
}

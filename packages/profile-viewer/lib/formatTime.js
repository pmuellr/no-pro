'use strict'

// return best of:
//    {microseconds} μs
//    {milliseconds} ms
//    {seconds} s
//    {minutes} m
//    {hours} h
//    {days} d

module.exports = function formatTime (time /* microSeconds */) {
  if (time < 1000) return `${Math.round(time)} μs`

  time = time / 1000

  if (time < 1000) return `${Math.round(time)} ms`

  time = time / 1000

  if (time < 60) return `${Math.round(time)} s`

  time = time / 60

  if (time < 60) return `${Math.round(time)} m`

  time = time / 60

  if (time < 24) return `${Math.round(time)} h`

  time = time / 24

  return `${time} d`
}

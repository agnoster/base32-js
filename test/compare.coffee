crypto = require 'crypto'
base32 = require 'base32'

Number.prototype.times = (fn) ->
  if this > 1
    fn.call()
    (this - 1).times fn

10.times ->
  str = 'foo' + Math.random()
  hex = crypto.createHash('sha1').update(str).digest('hex')
  b32 = base32.sha1(str)
  b64 = crypto.createHash('sha1').update(str).digest('base64')
  console.log '    Hex: ' + hex
  console.log '    B32: ' + b32
  console.log '    B64: ' + b64
  console.log ' '


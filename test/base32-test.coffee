vows = require 'vows'
assert = require 'assert'
base32 = require '../lib/base32.js'
crypto = require 'crypto'

suite = vows.describe 'Base32 Encoding'

teststring = 'lowercase UPPERCASE 1234567890'

suite = suite.addBatch
  'When encoding a sha1 sum':
    topic: ->
      base32.encode crypto.createHash('sha1').update(teststring).digest('binary')

    'it has the right value': (topic) ->
      assert.equal topic, 'nruhmw8hf8cg87gx84612m0bww3g80gv'

    'it has 32 characters': (topic) ->
      assert.equal topic.length, 32

  'When encoding a test string':
    topic: ->
      base32.encode teststring

    'it has the right value': (topic) ->
      assert.equal topic, 'dgqget8jccgg6t80am800h8j8c0g6h8064t06d0n6rvgge8g'

    'it decodes to the right value': (topic) ->
      assert.equal base32.decode(topic), teststring

suite.reporter = require 'vows/reporters/spec'
suite.run()

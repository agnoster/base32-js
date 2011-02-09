#!/usr/bin/env node
;(function(){
var base32 = require('base32')
  , fs = require('fs')
  , usage = 'Usage: base32 [input_file] [-o output_file] [-d|--decode]'
  , argv = require('optimist').usage(usage).argv
  , processor
  , input
  , output

if (argv.h) {
  console.log(usage)
  process.exit()
}

argv.putback = function() {
  var key
  for (var i = 0; i < arguments.length; i++) {
    arg = this[arguments[i]]
    if (typeof arg == 'string') this._.unshift(arg)
  }
}

function stream(input, output, processor) {
  var kB = 0
    , start = Date.now()
    , out

  input.on('data', function(chunk){
    out = processor.update(chunk)
    if (out) {
      output.write(out)
      if (input.isTTY && output.isTTY) output.write("\n")
    }
  })

  input.on('end', function(){
    out = processor.finish()
    if (out) output.write(out)
    if (output.isTTY) output.write("\n")
  })
}

// use stdout for output
if (argv.o && argv.o != '-') {
  output = fs.createWriteStream(argv.o)
} else {
  output = process.stdout
}

argv.putback('d', 'decode', 's', 'sha', 'sha1', 'hash')
if (argv.s || argv.hash || argv.sha || argv.sha1) {
  if (argv._.length == 0) argv._ = ['-']
  var filename
  for (var i = 0; i < argv._.length; i++) {
    filename = argv._[i]
    processor = (function(filename, hash) {
      return {
        update: function(chunk) {
                  hash.update(chunk)
                  return ''
        },
        finish: function() {
                  return hash.digest() + "  " + filename
        }
      }
    })(filename, base32.sha1())
    if (filename == '-') {
      input = process.stdin
      input.resume()
    } else {
      input = fs.createReadStream(filename)
    }
    stream(input, output, processor)
  }
  return
}

if (argv._.length > 0 && argv._[0] != '-') {
  input = fs.createReadStream(argv._[0])
} else {
  // use stdin for input
  process.stdin.resume()
  input = process.stdin
}

//encode
if (argv.d || argv.decode) {
  processor = new base32.Decoder()
  stream(input, output, processor)
} else {
  processor = new base32.Encoder()
  stream(input, output, processor)
}

})()

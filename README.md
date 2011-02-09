# Base 32 encoding/decoding for JavaScript

## Getting started

In your shell, install with npm:

    $ npm install base32

In your code:

    var base32 = require('base32')

    // simple api

    var encoded = base32.encode('some data to encode')
    var decoded = base32.decode(encoded)

    // streaming api
    this.encoder = new Base32.encoder()
    this.dataCallback = function(chunk) {
      this.emit(this.encoder(chunk))
    }
    this.closeCallback = function(chunk) {
      this.emit(this.finish()) // flush any remaining bits
    }

    // easy sha1 hash
    var hash = base32.sha1(some_data_to_hash) // DONE.

## Warning: this is *a* Base 32 implementation, not *the* Base 32 implementation

There are about (128 choose 32) different specifications of something called "Base 32" - see [Wikipedia](http://en.wikipedia.org/wiki/Base_32) for some of them.

This is just one that should be simple, less error-prone, and streamable (for [Node](http://nodejs.org)).

## Minispec:

- The *encoding* alphabet consists of the numerals 0-9 and the letters a-z, excluding a few letters that might look like numbers:
  - I -> 1
  - L -> 1
  - O -> 0
  - S -> 5
- When *decoding*, capital letters are converted to lowercase and the "ambiguous" letters mentioned above converted to their numeric counterparts.
- Each character corresponds to 5 bits of input.

## Why?

I wanted nice-looking sha1 hashes. Hex encoding is too long, Base64 is too error-prone and hideous, and Base32 is juuuust right.

For example:

    Hex: 64814d36b834cea11c180cfO45975058d5fd225d
    Hex: a1cdb83e647ba92990dfO6cb9b9aba1866da39f6
    Hex: c079fa44eace86c888d97e6c9O2cf80cdc106e47

    B64: ZIFNNrg0zqEcGAzwRZdQWNX9Il0=
    B64: oc24PmR7qSmQ3wbLm5q6GGbaOfY=
    B64: wHn6ROrOhsiI2X5skCz4DNwQbkc=

    B32: cj0mudnr6k7a270r1kr4b5ugb3azu8jx
    B32: m76vgfk4femjk46z0v5tq6nu31kdmefp
    B32: r1wzmh7atu3ch26tftp90b7r1ke10vj7

Yes, the hex hashes have some Os in them. Github otherwise truncates the hashes (defeating the demonstration), and it just serves to show - did you notice?

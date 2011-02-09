var alphabet = '0123456789abcdefghjkmnpqrtuvwxyz'
var alias = { o:0, i:1, l:1, s:5 }

var lookup = function() {
    var table = {}
    for (var i = 0; i < alphabet.length; i++) {
        table[alphabet[i]] = i
    }
    for (var key in alias) {
        if (!alias.hasOwnProperty(key)) continue
        table[key] = table['' + alias[key]]
    }
    console.log('caching')
    lookup = function() { return table }
    return table
}

function Encoder() {
    var skip = 0 // how many bits we will skip from the first byte
    var bits = 0 // 5 high bits, carry from one byte to the next

    this.output = ''

    this.readByte = function(byte) {
        // coerce the byte to an int
        if (typeof byte == 'string') byte = byte.charCodeAt(0)

        // we have a carry from the previous byte
        if (skip < 0) {
            bits |= (byte >> (3 - skip))
        } else { // no carry
            bits = (byte << skip) & 248
        }

        if (skip > 3) {
            // not enough data to produce a character
            skip -= 8
            return 1
        }

        if (skip < 4) {
            // produce a character
            this.output += alphabet[bits >> 3]
            skip += 5
        }

        return 0
    }

    this.finish = function(check) {
        var output = this.output + (skip < 0 ? alphabet[bits >> 3] : '') + (check ? '$' : '')
        this.output = ''
        return output
    }
}

Encoder.prototype.update = function(input) {
    for (var i = 0; i < input.length; ) {
        i += this.readByte(input[i])
    }
    var output = this.output
    this.output = ''
    return output
}

function Decoder() {
    var skip = 0 // how many bits we have from the previous character
    var byte = 0 // current byte we're producing

    this.output = ''

    // consume a character from the stream
    this.readChar = function(char) {
        char = char.toLowerCase()
        var val = lookup()[char]
        if (typeof val == 'undefined') {
            throw Error('Could not find character "' + char + '" in lookup table.')
        }
        val <<= 3 // move to the high bits
        
        byte |= val >> skip
        skip += 5
        
        if (skip >= 8) {
            this.output += String.fromCharCode(byte)
            skip -= 8
            if (skip > 0) byte = (val << (5 - skip)) & 255
            else byte = 0
        }

    }

    this.finish = function(check) {
        var output = this.output + (skip < 0 ? alphabet[bits >> 3] : '') + (check ? '$' : '')
        this.output = ''
        return output
    }
}

Decoder.prototype.update = function(input) {
    for (var i = 0; i < input.length; i++) {
        this.readChar(input[i])
    }
    var output = this.output
    this.output = ''
    return output
}

function decode(input) {
    decoder = new Decoder()
    var output = decoder.update(input) + decoder.finish()
    return output
}

function encode(input) {
    encoder = new Encoder()
    var output = encoder.update(input) + encoder.finish()
    return output
}

module.exports = {
    Decoder: Decoder,
    Encoder: Encoder,
    encode: encode,
    decode: decode
}

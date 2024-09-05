import AlphaCodec from "./alphacodec"
import { base32_js } from "./encoding"

export default class Encoder {
    #skip = 0 // how many bits we will skip from the first byte
    #bits = 0 // 5 high bits, carry from one byte to the next
    private output = ""

    constructor(public readonly base32_encoding: AlphaCodec = base32_js) {}

    update(input: string | Buffer, flush?: boolean): string {
        if (typeof input === "string") {
            input = Buffer.from(input)
        }
        for (let i = 0; i < input.length; ) {
            i += this.readByte(input[i])
        }
        // consume all output
        let output = this.output
        this.output = ""
        if (flush) {
            output += this.finish()
        }
        return output
    }

    finish(check?: boolean): string {
        const output =
            this.output +
            (this.#skip < 0
                ? this.base32_encoding.characterForValue(this.#bits >> 3)
                : "") +
            (check ? "$" : "")
        this.output = ""
        return output
    }

    // Read one byte of input
    // Should not really be used except by "update"
    private readByte(byte: string | number) {
        // coerce the byte to an int
        if (typeof byte === "string") byte = byte.charCodeAt(0)

        if (this.#skip < 0) {
            // we have a carry from the previous byte
            this.#bits |= byte >> -this.#skip
        } else {
            // no carry
            this.#bits = (byte << this.#skip) & 248
        }

        if (this.#skip > 3) {
            // not enough data to produce a character, get us another one
            this.#skip -= 8
            return 1
        }

        if (this.#skip < 4) {
            // produce a character
            this.output += this.base32_encoding.characterForValue(
                this.#bits >> 3
            )
            this.#skip += 5
        }

        return 0
    }
}

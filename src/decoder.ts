import AlphaCodec from "./alphacodec"
import { base32_js } from "./encoding"

type DecoderOutput<T> = T extends null ? Buffer : string

export default class Decoder<
    T extends BufferEncoding | undefined | null = undefined
> {
    #skip = 0 // how many bits we have from the previous character
    #byte = 0 // current byte we're producing
    private output = Buffer.alloc(0)
    public readonly buffer_encoding: T

    constructor(
        public readonly base32_encoding: AlphaCodec = base32_js,
        buffer_encoding?: T
    ) {
        this.buffer_encoding =
            buffer_encoding === undefined ? ("utf-8" as T) : buffer_encoding
    }

    update(input: string | Buffer, flush?: boolean): DecoderOutput<T> {
        for (let i = 0; i < input.length; i++) {
            this.readChar(input[i])
        }
        let output = this.output
        this.output = Buffer.alloc(0)
        if (flush) {
            output = Buffer.concat([output, this.finish()])
        }
        return this._value(output)
    }

    finish(): Buffer {
        return this.output
    }

    private _value(data: Buffer): DecoderOutput<T> {
        return (
            this.buffer_encoding ? data.toString(this.buffer_encoding) : data
        ) as DecoderOutput<T>
    }

    private readChar(char: string | number) {
        if (typeof char !== "string") {
            if (typeof char === "number") {
                char = String.fromCharCode(char)
            }
        }
        char = char.toLowerCase()
        let val = this.base32_encoding.characterValue(char)
        if (typeof val === "undefined") {
            throw Error(`Could not find character "${char}" in lookup table.`)
        }
        val <<= 3 // move to the high bits
        this.#byte |= val >>> this.#skip
        this.#skip += 5
        if (this.#skip >= 8) {
            // we have enough to produce output
            this.output = Buffer.concat([
                this.output,
                Buffer.from([this.#byte]),
            ])
            this.#skip -= 8
            if (this.#skip > 0) this.#byte = (val << (5 - this.#skip)) & 255
            else this.#byte = 0
        }
    }
}

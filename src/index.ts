import Encoder from "./encoder"
import AlphaCodec from "./alphacodec"
import * as Encoding from "./encoding"
import Decoder from "./decoder"

class Base32 {
    constructor(public readonly encoding: AlphaCodec = Encoding.base32_js) {}

    makeEncoder(): Encoder {
        return new Encoder(this.encoding)
    }

    makeDecoder(): Decoder<null>
    makeDecoder<T extends BufferEncoding | null>(buffer_encoding: T): Decoder<T>
    makeDecoder<T extends BufferEncoding | null | undefined>(
        buffer_encoding?: T
    ) {
        return new Decoder(this.encoding, buffer_encoding)
    }

    encode(data: string | Buffer): string {
        const encoder = this.makeEncoder()
        return encoder.update(data, true)
    }

    decode(data: string): string
    decode(data: string, buffer_encoding: null): Buffer
    decode(data: string, buffer_encoding: BufferEncoding): string
    decode(
        data: string,
        buffer_encoding: BufferEncoding | undefined | null = "utf8"
    ): Buffer | string {
        if (buffer_encoding === undefined) {
            buffer_encoding = "utf8"
        }
        const decoder = this.makeDecoder(buffer_encoding)
        return decoder.update(data, true)
    }
}

export default Base32

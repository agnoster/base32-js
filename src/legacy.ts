import Encoder from "./encoder"
import AlphaCodec from "./alphacodec"
import * as Encoding from "./encoding"
import Decoder from "./decoder"
import legacy_sha1 from "./node/sha1"

export function encode(
    data: string | Buffer,
    base32_encoding: AlphaCodec = Encoding.base32_js
): string {
    const encoder = new Encoder(base32_encoding)
    return encoder.update(data, true)
}

export function decode(data: string, base32_encoding?: AlphaCodec): string
export function decode(
    data: string,
    base32_encoding: AlphaCodec,
    buffer_encoding: null
): Buffer
export function decode(
    data: string,
    base32_encoding: AlphaCodec,
    buffer_encoding: BufferEncoding
): string
export function decode(
    data: string,
    base32_encoding: AlphaCodec = Encoding.base32_js,
    buffer_encoding: BufferEncoding | undefined | null = "utf8"
): Buffer | string {
    if (buffer_encoding === undefined) {
        buffer_encoding = "utf8"
    }
    const decoder = new Decoder(base32_encoding, buffer_encoding)
    return decoder.update(data, true)
}

export { Encoder, Decoder, AlphaCodec, Encoding, legacy_sha1 as sha1 }

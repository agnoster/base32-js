import * as crypto from "crypto"
import * as base32 from "../src/legacy"

const samples = Array.from({ length: 5 }, () => `foo${Math.random()}`)

function sha1(
    str: string,
    encoding: base32.AlphaCodec | crypto.BinaryToTextEncoding
): string {
    const hash = crypto.createHash("sha1").update(str)
    return typeof encoding === "string"
        ? hash.digest(encoding)
        : base32.encode(hash.digest(), encoding)
}

const encodings = {
    Hexadecimal: "hex",
    Base64: "base64",
    ...base32.Encoding,
} as const

Object.entries(encodings).map(([name, encoding]) => {
    console.log(`\n${name}:\n`)
    samples.forEach((str) => {
        console.log(`    ${sha1(str, encoding)}`)
    })
})

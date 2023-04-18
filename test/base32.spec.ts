import * as base32 from "../src/legacy"
import { Decoder, Encoder, Encoding } from "../src/legacy"
import * as crypto from "crypto"

const teststring = "lowercase UPPERCASE 1234567 !@#$%^&*"

describe("Base32 Encoding", () => {
    test("When encoding a test string", () => {
        const encoded = base32.encode(teststring)
        expect(encoded).toBe(
            "dhqqetbjcdgq6t90an850haj8d0n6h9064t36d1n6rvj08a04cj2aqh658"
        )
    })

    test("When decoding a test string", () => {
        const encoded =
            "dhqqetbjcdgq6t90an850haj8d0n6h9064t36d1n6rvj08a04cj2aqh658"
        expect(base32.decode(encoded)).toBe(teststring)
    })

    test("When encoding a sha1 buffer", () => {
        const sha1 = crypto.createHash("sha1").update(teststring).digest()
        const encoded = base32.encode(sha1)
        expect(encoded).toBe("1wwn60g9bv8n5g8n72udmk7yqm80dvtu")
        expect(encoded.length).toBe(32)
        expect(
            base32.decode(encoded, base32.Encoding.base32_js, null)
        ).toStrictEqual(sha1)
    })

    test("When streaming a string to encode", () => {
        const enc = new Encoder()
        let output = enc.update(teststring.substring(0, 10))
        output += enc.update(teststring.substring(10))
        output += enc.finish()
        expect(output).toBe(
            "dhqqetbjcdgq6t90an850haj8d0n6h9064t36d1n6rvj08a04cj2aqh658"
        )
    })

    test("When decoding a string with common errors", () => {
        const decoded = base32.decode(
            "dHqqetbjcdgq6t9Oan850hAj8d0n6h9O64t36dLn6rvjO8a04cj2aqh6S8"
        )
        expect(decoded).toBe(teststring)
    })

    test("When encoding an empty string", () => {
        const encoded = base32.encode("")
        expect(encoded).toBe("")
    })

    test("When decoding an empty string", () => {
        const decoded = base32.decode("")
        expect(decoded).toBe("")
    })

    test("When encoding and decoding a string containing only special characters", () => {
        const specialString = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        const encoded = base32.encode(specialString)
        const decoded = base32.decode(encoded)
        expect(decoded).toBe(specialString)
    })

    test("When streaming a string to decode", () => {
        const encoded =
            "dhqqetbjcdgq6t90an850haj8d0n6h9064t36d1n6rvj08a04cj2aqh658"
        const dec = new Decoder(Encoding.base32_js, "utf8")
        let output = dec.update(encoded.substring(0, 10))
        output += dec.update(encoded.substring(10))
        output += dec.finish()
        expect(output).toBe(teststring)
    })

    test("When encoding and decoding a buffer", () => {
        const buffer = crypto.randomBytes(64)
        const encoded = base32.encode(buffer)
        const decoded = base32.decode(encoded, Encoding.base32_js, null)
        expect(decoded).toStrictEqual(buffer)
    })
})

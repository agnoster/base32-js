import * as crypto from "node:crypto"
import * as fs from "node:fs"
import { AlphaCodec, Encoding, encode } from "../legacy"

type Callback<T> = (err: unknown | null, result: T | null) => unknown

type Input = string | Buffer
type InputGenerator = {
    [Symbol.asyncIterator](): AsyncIterableIterator<Input>
}

class Base32Hash {
    #hash: crypto.Hash
    private encoding: AlphaCodec

    constructor(hash: crypto.Hash, encoding: AlphaCodec) {
        this.#hash = hash
        this.encoding = encoding
    }

    update(input: Input): this {
        this.#hash.update(input)
        return this
    }

    async consume(generator: InputGenerator): Promise<this> {
        for await (const chunk of generator) {
            this.#hash.update(chunk)
        }
        return this
    }

    digest(): string {
        return encode(this.#hash.digest(), this.encoding)
    }

    static create(
        algorithm: string,
        encoding: AlphaCodec = Encoding.base32_js,
        options?: crypto.HashOptions
    ): Base32Hash {
        return new Base32Hash(crypto.createHash(algorithm, options), encoding)
    }

    async hash(input: Input | InputGenerator): Promise<string> {
        if (typeof input === "string" || Buffer.isBuffer(input)) {
            this.update(input)
        } else if (typeof input[Symbol.asyncIterator] === "function") {
            await this.consume(input)
        } else {
            throw new Error("Invalid input: " + input)
        }
        return this.digest()
    }
}

function legacy_sha1(): Base32Hash
function legacy_sha1(input: Input): string
function legacy_sha1(input: Input | InputGenerator, cb: Callback<string>): void
function legacy_sha1(
    input?: Buffer | string | InputGenerator,
    cb?: Callback<string>
): string | Base32Hash | void {
    const hash = new Base32Hash(crypto.createHash("sha1"), Encoding.base32_js)

    if (input !== undefined) {
        if (cb !== undefined) {
            hash.hash(input).then(
                (result) => cb(null, result),
                (err) => cb(err, null)
            )
            return
        } else {
            if (typeof input === "string" || Buffer.isBuffer(input)) {
                return hash.update(input).digest()
            } else {
                throw new Error("Invalid input for synchronous call: " + input)
            }
        }
    }

    // return hash
    return hash
}

legacy_sha1.file = async function (filename: string, cb: Callback<string>) {
    if (filename === "-") {
        process.stdin.resume()
        return legacy_sha1(process.stdin, cb)
    }
    fs.stat(filename, (err, stats) => {
        if (err) return cb(err, null)
        if (stats.isDirectory())
            return cb({ dir: true, message: "Is a directory" }, null)
        return legacy_sha1(fs.createReadStream(filename), cb)
    })
}

export default legacy_sha1

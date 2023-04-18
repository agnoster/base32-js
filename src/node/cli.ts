import { Readable, Writable } from "node:stream"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { ReadStream, WriteStream } from "node:tty"
import sha1 from "./sha1"
import * as fs from "node:fs"
import Decoder from "../decoder"
import Encoder from "../encoder"

const argv = yargs(hideBin(process.argv))
    .usage(
        "Usage: base32 [input_file] [-o output_file] [-d|--decode] [-s|--sha]"
    )
    .option("o", {
        type: "string",
        describe: "Output file",
        default: "-",
    })
    .option("d", {
        alias: "decode",
        type: "boolean",
        describe: "Decode input",
    })
    .option("s", {
        alias: ["sha", "sha1", "hash"],
        type: "boolean",
        describe: "Hash input",
    })
    .option("r", {
        type: "boolean",
        describe: "Recursive hashing",
    })
    .option("v", {
        type: "boolean",
        describe: "Version",
    })
    .option("h", {
        alias: "help",
        type: "boolean",
        describe: "Help",
    })
    .parseSync()

function isTTY(stream: Readable): stream is ReadStream
function isTTY(stream: Writable): stream is WriteStream
function isTTY(stream: Readable | Writable): boolean {
    return "isTTY" in stream
}

function stream(
    input: Readable,
    output: Writable,
    processor: Encoder | Decoder
): void {
    let out: Buffer | string | null

    input.on("data", (chunk: Buffer) => {
        out = processor.update(chunk)
        if (out) {
            output.write(out)
            if (isTTY(input) && isTTY(output)) output.write("\n")
        }
    })

    input.on("end", () => {
        out = processor.finish()
        if (out) output.write(out)
        if (isTTY(output)) output.write("\n")
    })
}

function hash_file(filename: string, output: Writable): void {
    sha1.file(filename, (err: unknown, hash: string | null) => {
        if (err && typeof err === "object") {
            if ("dir" in err) {
                if (argv.r || argv.d) {
                    fs.readdir(
                        filename,
                        (
                            err: NodeJS.ErrnoException | null,
                            files: string[]
                        ) => {
                            if (err) {
                                return process.stderr.write(
                                    `base32: ${filename}: ${err.message}\n`
                                )
                            }
                            for (const file of files) {
                                hash_file(`${filename}/${file}`, output)
                            }
                        }
                    )
                }
                if (!argv.r && !argv.d && "message" in err) {
                    return process.stderr.write(
                        `base32: ${filename}: ${err?.message}\n`
                    )
                }
            }
            return
        }
        output.write(`${hash}  ${filename}\n`)
    })
}

// Your stream and hash_file functions should be defined here
export function runCli() {
    if (argv.h) {
        yargs.showHelp()
        return
    }

    if (argv.v) {
        console.log("v0.0.2")
        return
    }

    let processor: Encoder | Decoder
    let input: fs.ReadStream | NodeJS.ReadStream
    let output: fs.WriteStream | NodeJS.WriteStream

    if (argv.d || argv.decode) {
        processor = new Decoder()
    } else {
        processor = new Encoder()
    }

    if (argv.o && argv.o !== "-") {
        output = fs.createWriteStream(argv.o)
    } else {
        output = process.stdout
    }

    if (argv._.length === 0) argv._.push("-")

    if (argv.s || argv.hash || argv.sha || argv.sha1) {
        if (argv._.length === 0) argv._ = ["-"]
        for (const filename of argv._) {
            hash_file(`${filename}`, output)
        }
        return
    }

    for (const filename of argv._) {
        if (filename === "-") {
            input = process.stdin
            process.stdin.resume()
        } else {
            input = fs.createReadStream(`${filename}`)
        }
        stream(input, output, processor)
    }
}

runCli()

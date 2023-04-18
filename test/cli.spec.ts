import execa from "execa"
import * as fs from "node:fs"

describe("base32 CLI", () => {
    it("encodes a file", async () => {
        const inputFile = "test/fixtures/LICENSE.txt"
        const expectedOutput = fs.readFileSync(
            "test/fixtures/LICENSE.txt.base32",
            "utf8"
        )

        const { stdout } = await execa("npx", ["base32", inputFile])

        expect(stdout).toEqual(expectedOutput)
    })

    it("decodes a file", async () => {
        const inputFile = "test/fixtures/LICENSE.txt.base32"
        const expectedOutput = fs.readFileSync(
            "test/fixtures/LICENSE.txt",
            "utf8"
        )

        const { stdout } = await execa("npx", ["base32", "-d", inputFile])

        expect(stdout).toEqual(expectedOutput)
    })

    it("encodes from stdin", async () => {
        const input = "Hello, World!"
        const expectedOutput = "91jprv3f5gg5evvjdhj22"

        const { stdout } = await execa("npx", ["base32"], { input })

        expect(stdout.trim()).toEqual(expectedOutput)
    })

    it("decodes from stdin", async () => {
        const input = "91jprv3f5gg5evvjdhj22"
        const expectedOutput = "Hello, World!"

        const { stdout } = await execa("npx", ["base32", "-d"], { input })

        expect(stdout.trim()).toEqual(expectedOutput)
    })

    it("hashes a file", async () => {
        const inputFile = "test/fixtures/LICENSE.txt"
        const expectedOutput =
            "pwd0mnqvj63u99125jevb6vxn8w4bvaq  test/fixtures/LICENSE.txt"

        const { stdout } = await execa("npx", ["base32", "-s", inputFile])

        expect(stdout.trim()).toEqual(expectedOutput)
    })

    it("hashes from stdin", async () => {
        const input = "Hello, World!"
        const expectedOutput = "1859yak7eaa2anxbadaxeuqm8bwfcqg1  -"

        const { stdout } = await execa("npx", ["base32", "-s"], { input })

        expect(stdout.trim()).toEqual(expectedOutput)
    })
})

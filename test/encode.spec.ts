import { encode } from "../src/legacy"

describe("base32 encode function", () => {
    test("should encode a simple string", () => {
        const input = "Hello, world!"
        const expectedOutput = "91jprv3f5gg7evvjdhj22"

        expect(encode(input)).toBe(expectedOutput)
    })

    test("should encode a string with special characters", () => {
        const input = "@$%&*()-_=+[]{};:`~"
        const expectedOutput = "80j2a9ha50mjuqtx5ddnuyvx7cx60zg"

        expect(encode(input)).toBe(expectedOutput)
    })

    test("should encode an empty string", () => {
        const input = ""
        const expectedOutput = ""

        expect(encode(input)).toBe(expectedOutput)
    })

    test("should encode a string containing numbers", () => {
        const input = "1234567890"
        const expectedOutput = "64t36d1n6rvkge9g"

        expect(encode(input)).toBe(expectedOutput)
    })
})

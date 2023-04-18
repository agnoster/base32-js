import * as crypto from "crypto"
import * as base32 from "../src/legacy"

function times(n: number, fn: () => void): void {
    for (let i = 0; i < n; i++) fn()
}

console.log("Hexadecimal:\n")
times(5, () => {
    const str = `foo${Math.random()}`
    console.log(`    ${crypto.createHash("sha1").update(str).digest("hex")}`)
})

console.log("\nBase 64:\n")
times(5, () => {
    const str = `foo${Math.random()}`
    console.log(
        `    ${crypto
            .createHash("sha1")
            .update(str)
            .digest("base64")
            .substring(0, 27)
            .replace("/", "_")
            .replace("+", "-")}`
    )
})

console.log("\nBase 32:\n")
times(5, () => {
    const str = `foo${Math.random()}`
    console.log(`    ${base32.sha1(str)}`)
})

/**
 * Defines an encoding of bytes to chars and back that uses an "alphabet",
 * mapping each valid character of the encoding to a single binary sub-byte
 * value.
 *
 * Uniquely defined by:
 * - alphabet: the primary alphabet, a string of characters in order. The length
 *   must be a power of 2
 * - alias: additional characters that can be read as aliases for another
 *   character in the alphabet - for example, in a case-insensitive encoding,
 *   'a' could be an alias for 'A'.
 *
 * Two encodings with the same alphabet and aliases are identical.
 */
export default class AlphaCodec {
    #characterValue: Record<string, number> = {}
    #alphabet: string
    #case_insensitive = true

    normalize(str: string): string {
        if (this.#case_insensitive) {
            return str.toLowerCase()
        }
        return str
    }

    constructor(alphabet: string, aliases: Record<string, string> = {}) {
        this.#alphabet = alphabet

        for (let i = 0; i < this.#alphabet.length; i++) {
            this.#characterValue[this.normalize(alphabet[i])] = i
        }

        for (const char in aliases) {
            this.#characterValue[char] = this.characterValue(aliases[char])
        }
    }

    characterValue(char: string): number {
        return this.#characterValue[this.normalize(char)]
    }

    characterForValue(value: number): string {
        return this.#alphabet[value]
    }
}

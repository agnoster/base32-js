import Base32 from "../src/index"
import * as Encoding from "../src/encoding"

const base32 = new Base32(Encoding.base32)

describe("compatibility with hi-base32 package", () => {
    test("Long text encoding", () => {
        const input =
            "Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure."
        const expected =
            "JVQW4IDJOMQGI2LTORUW4Z3VNFZWQZLEFQQG433UEBXW43DZEBRHSIDINFZSA4TFMFZW63RMEBRHK5BAMJ4SA5DINFZSA43JNZTXK3DBOIQHAYLTONUW63RAMZZG63JAN52GQZLSEBQW42LNMFWHGLBAO5UGSY3IEBUXGIDBEBWHK43UEBXWMIDUNBSSA3LJNZSCYIDUNBQXIIDCPEQGCIDQMVZHGZLWMVZGC3TDMUQG6ZRAMRSWY2LHNB2CA2LOEB2GQZJAMNXW45DJNZ2WKZBAMFXGIIDJNZSGKZTBORUWOYLCNRSSAZ3FNZSXEYLUNFXW4IDPMYQGW3TPO5WGKZDHMUWCAZLYMNSWKZDTEB2GQZJAONUG64TUEB3GK2DFNVSW4Y3FEBXWMIDBNZ4SAY3BOJXGC3BAOBWGKYLTOVZGKLQ"
        expect(base32.encode(input)).toBe(expected)
        expect(base32.decode(expected)).toBe(input)
    })

    test("Decoding to string", () => {
        expect(base32.decode("JBSWY3DP")).toBe("Hello")
    })

    test("Decoding to bytes", () => {
        const buffer = base32.decode("JBSWY3DP", null)
        const bytes = Array.from(buffer)
        expect(bytes).toEqual([72, 101, 108, 108, 111])
    })

    test("UTF-8 encoding", () => {
        expect(base32.encode("中文")).toBe("4S4K3ZUWQ4")
    })
})

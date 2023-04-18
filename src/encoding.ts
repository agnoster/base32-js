import AlphaCodec from "./alphacodec"

export const base32_js = new AlphaCodec("0123456789abcdefghjkmnpqrtuvwxyz", {
    o: "0",
    i: "1",
    l: "1",
    s: "5",
})

export const crockford = new AlphaCodec("0123456789ABCDEFGHJKMNPQRSTVWXYZ", {
    I: "1",
    L: "1",
    O: "0",
    U: "V",
})

export const base32hex = new AlphaCodec("0123456789ABCDEFGHIJKLMNOPQRSTUV")

export const rfc4648 = new AlphaCodec("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", {
    0: "O",
    1: "I",
    8: "B",
})

export const base32 = rfc4648

export const zbase32 = new AlphaCodec("ybndrfg8ejkmcpqxot1uwisza345h769")

export const geohash = new AlphaCodec("0123456789bcdefghjkmnpqrstuvwxyz")

import * as Encodings from "../src/encoding"
import * as base32 from "../src/legacy"
import AlphaCodec from "../src/alphacodec"

const teststring = "lowercase UPPERCASE 1234567 !@#$%^&*"

// A buffer with every possible byte value
const testbuffer = Buffer.from(Array.from({ length: 255 }, (_, i) => i))

function testStringEncoding(
    encoding: AlphaCodec,
    teststring: string,
    expected: string
) {
    const encoded = base32.encode(teststring, encoding)
    expect(encoded).toBe(expected)
    const decoded = base32.decode(encoded, encoding)
    expect(decoded).toBe(teststring)
}

function testBufferEncoding(
    encoding: AlphaCodec,
    testbuffer: Buffer,
    expected: string
) {
    const encoded = base32.encode(testbuffer, encoding)
    expect(encoded).toBe(expected)
    const decoded = base32.decode(encoded, encoding, null)
    expect(decoded).toStrictEqual(testbuffer)
}

describe("Base32 Encodings", () => {
    test("Encoding and decoding with default base32_js encoding", () => {
        const encoding = Encodings.base32_js
        testStringEncoding(
            encoding,
            teststring,
            "dhqqetbjcdgq6t90an850haj8d0n6h9064t36d1n6rvj08a04cj2aqh658"
        )
        testBufferEncoding(
            encoding,
            testbuffer,
            "000g40r40m30e209185gr38e1w8124gk2gahc5rr34d1p70x3rfj08924cj2a9h750mjmatc5mq2yc1h68tk8d9p6ww3jehv7gykwfu085146h258t3mgjaa9d64ukjfa18n4mumanb5ep2tb9dnrqaybxg62rk3chjpctv8d5n6pv3ddtqq0wbjedu7axkqf1wqmyvwfnz7z041ga1r91c6gy48k2mbhj6rx3wgj699754njubth6cukee9v7mzm2gu58x4mpkafa59nanutbdenyrb3cnkpjuvddxrq6xbqf5xquzw1ge2rf2cbhp7t34wnjyctq7czm6hub9x9nepuzcdkppvvkexxqz0w7he7t75wvkyhufaxfpevvqfy3rz5wzmyqvffy7tzbxztzfy"
        )
    })

    test("Encoding and decoding with crockford encoding", () => {
        const encoding = Encodings.crockford
        testStringEncoding(
            encoding,
            teststring,
            "DHQQESBJCDGQ6S90AN850HAJ8D0N6H9064S36D1N6RVJ08A04CJ2AQH658"
        )
        testBufferEncoding(
            encoding,
            testbuffer,
            "000G40R40M30E209185GR38E1W8124GK2GAHC5RR34D1P70X3RFJ08924CJ2A9H750MJMASC5MQ2YC1H68SK8D9P6WW3JEHV7GYKWFT085146H258S3MGJAA9D64TKJFA18N4MTMANB5EP2SB9DNRQAYBXG62RK3CHJPCSV8D5N6PV3DDSQQ0WBJEDT7AXKQF1WQMYVWFNZ7Z041GA1R91C6GY48K2MBHJ6RX3WGJ699754NJTBSH6CTKEE9V7MZM2GT58X4MPKAFA59NANTSBDENYRB3CNKPJTVDDXRQ6XBQF5XQTZW1GE2RF2CBHP7S34WNJYCSQ7CZM6HTB9X9NEPTZCDKPPVVKEXXQZ0W7HE7S75WVKYHTFAXFPEVVQFY3RZ5WZMYQVFFY7SZBXZSZFY"
        )
    })

    test("Encoding and decoding with base32hex encoding", () => {
        const encoding = Encodings.base32hex
        testStringEncoding(
            encoding,
            teststring,
            "DHNNEPBICDGN6P90AL850HAI8D0L6H9064P36D1L6ORI08A04CI2ANH658"
        )
        testBufferEncoding(
            encoding,
            testbuffer,
            "000G40O40K30E209185GO38E1S8124GJ2GAHC5OO34D1M70T3OFI08924CI2A9H750KIKAPC5KN2UC1H68PJ8D9M6SS3IEHR7GUJSFQ085146H258P3KGIAA9D64QJIFA18L4KQKALB5EM2PB9DLONAUBTG62OJ3CHIMCPR8D5L6MR3DDPNN0SBIEDQ7ATJNF1SNKURSFLV7V041GA1O91C6GU48J2KBHI6OT3SGI699754LIQBPH6CQJEE9R7KVK2GQ58T4KMJAFA59LALQPBDELUOB3CLJMIQRDDTON6TBNF5TNQVS1GE2OF2CBHM7P34SLIUCPN7CVK6HQB9T9LEMQVCDJMMRRJETTNV0S7HE7P75SRJUHQFATFMERRNFU3OV5SVKUNRFFU7PVBTVPVFU"
        )
    })

    test("Encoding and decoding with rfc4648 encoding", () => {
        const encoding = Encodings.rfc4648
        testStringEncoding(
            encoding,
            teststring,
            "NRXXOZLSMNQXGZJAKVIFARKSINAVGRJAGEZDGNBVGY3SAIKAEMSCKXRGFI"
        )
        testBufferEncoding(
            encoding,
            testbuffer,
            "AAAQEAYEAUDAOCAJBIFQYDIOB4IBCEQTCQKRMFYYDENBWHA5DYPSAIJCEMSCKJRHFAUSUKZMFUXC6MBRGIZTINJWG44DSOR3HQ6T4P2AIFBEGRCFIZDUQSKKJNGE2TSPKBIVEU2UKVLFOWCZLJNVYXK6L5QGCYTDMRSWMZ3INFVGW3DNNZXXA4LSON2HK5TXPB4XU634PV7H7AEBQKBYJBMGQ6EITCULRSGY5D4QSGJJHFEVS2LZRGM2TOOJ3HU7UCQ2FI5EUWTKPKFJVKV2ZLNOV6YLDMVTWS23NN5YXG5LXPF5X274BQOCYPCMLRWHZDE4VS6MZXHM7UGR2LJ5JVOW27MNTWW33TO55X7A4HROHZHF43T6R2PK5PWO33XP6DY7F47U6X3PP6HZ7L57Z7P6"
        )
    })

    test("Encoding and decoding with zbase32 encoding", () => {
        const encoding = Encodings.zbase32
        testStringEncoding(
            encoding,
            teststring,
            "ptzzq3m1cpozg3jykiefytk1epyigtjygr3dgpbiga51yekyrc1nkztgfe"
        )
        testBufferEncoding(
            encoding,
            testbuffer,
            "yyyoryarywdyqnyjbefoadeqbhebnrounoktcfaadrpbs8y7dax1yejnrc1nkjt8fyw1wk3cfwzn6cbtge3uepjsghhd1qt58o6uhx4yefbrgtnfe3dwo1kkjpgr4u1xkbeirw4wkimfqsn3mjpiazk6m7ognaudct1sc35epfigs5dpp3zzyhm1qp48k7uzxbhzw65hxi989yrbokbajbcgo6reunwmt1ga7dho1gjj8fri14m3tgc4uqqj58w9wno4fe7rwsukxkfjiki43mpqi6amdcius145pp7azg7mzxf7z49hboqnaxncmts83drhi16c3z8c9wgt4mj7jiqs49cpuss55uq77z9yh8tq838fh5u6t4xk7xsq55zx6da9fh9w6z5xx6839m7939x6"
        )
    })

    test("Encoding and decoding with geohash encoding", () => {
        const encoding = Encodings.geohash
        testStringEncoding(
            encoding,
            teststring,
            "ejrrftckdehr6t90bp850jbk8e0p6j9064t36e1p6svk08b04dk2brj658"
        )
        testBufferEncoding(
            encoding,
            testbuffer,
            "000h40s40n30f209185hs38f1w8124hm2hbjd5ss34e1q70x3sgk08924dk2b9j750nknbtd5nr2yd1j68tm8e9q6ww3kfjv7hymwgu085146j258t3nhkbb9e64umkgb18p4nunbpc5fq2tc9epsrbycxh62sm3djkqdtv8e5p6qv3eetrr0wckfeu7bxmrg1wrnyvwgpz7z041hb1s91d6hy48m2ncjk6sx3whk699754pkuctj6dumff9v7nzn2hu58x4nqmbgb59pbputcefpysc3dpmqkuveexsr6xcrg5xruzw1hf2sg2dcjq7t34wpkydtr7dzn6juc9x9pfquzdemqqvvmfxxrz0w7jf7t75wvmyjugbxgqfvvrgy3sz5wznyrvggy7tzcxztzgy"
        )
    })
})

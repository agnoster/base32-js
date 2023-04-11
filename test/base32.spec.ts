import * as base32 from '../src/base32';
import * as crypto from 'crypto';

const teststring = 'lowercase UPPERCASE 1234567 !@#$%^&*';

describe('Base32 Encoding', () => {
    test('When encoding a test string', () => {
        const encoded = base32.encode(teststring);
        expect(encoded).toBe('dhqqetbjcdgq6t90an850haj8d0n6h9064t36d1n6rvj08a04cj2aqh658');
        expect(base32.decode(encoded)).toBe(teststring);
    });

    test('When encoding a sha1 sum', () => {
        const sha1 = crypto.createHash('sha1').update(teststring).digest('binary');
        const encoded = base32.encode(sha1);
        expect(encoded).toBe('1wwn60g9bv8n5g8n72udmk7yqm80dvtu');
        expect(encoded.length).toBe(32);
        expect(base32.decode(encoded)).toBe(sha1);
    });

    test('When using the built-in hasher', () => {
        const hash = base32.sha1(teststring);
        expect(hash).toBe('1wwn60g9bv8n5g8n72udmk7yqm80dvtu');
    });

    test('When streaming a string to encode', () => {
        const enc = new base32.Encoder();
        let output = enc.update(teststring.substr(0, 10));
        output += enc.update(teststring.substr(10));
        output += enc.finish();
        expect(output).toBe('dhqqetbjcdgq6t90an850haj8d0n6h9064t36d1n6rvj08a04cj2aqh658');
    });

    test('When decoding a string with common errors', () => {
        const decoded = base32.decode('dHqqetbjcdgq6t9Oan850hAj8d0n6h9O64t36dLn6rvjO8a04cj2aqh6S8');
        expect(decoded).toBe(teststring);
    });

    test('When using a streaming hash', () => {
        const hash = base32.sha1();
        hash.update(teststring.substr(0, 10));
        hash.update(teststring.substr(10));
        expect(hash.digest()).toBe('1wwn60g9bv8n5g8n72udmk7yqm80dvtu');
    });

    test('When we hash a file', (done) => {
        base32.sha1.file('./LICENSE', (error, hash) => {
            if (error) {
                done(error);
            } else {
                expect(hash).toBe('za118kbdknm728mwx9r5g9rtv3mw2y4d');
                done();
            }
        });
    });

});
export function encode(input: string | Buffer): string;
export function decode(input: string): string;
export const sha1: ((input?: string) => Sha1) & { file: (filePath: string, callback: (error: Error | null, hash: string | null) => void) => void };

export class Encoder {
    update(input: string): string;
    finish(): string;
}

export class Sha1 {
    update(input: string): this;
    digest(): string;
}
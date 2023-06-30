import {describe, expect, test} from '@jest/globals';


import { encode, decode } from '../src/base32';

describe('Base32', () => {
  test('Encode and decode should be inverses', () => {
    const originalData = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

    const encodedData = encode(originalData);
    expect(typeof encodedData).toBe('string');
    expect(encodedData).toEqual('00041061050r3gg28a1c60t3gf');

    const decodedData = decode(encodedData);
    expect(decodedData).toEqual(originalData);
  });
});
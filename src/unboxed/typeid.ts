import { stringify, v7 } from "uuid";
import { parseUUID } from "../parse_uuid";
import { encode, decode } from "../base32";
import { isValidPrefix } from "../prefix";

export type TypeId<T> = string & { __type: T };

export function typeidUnboxed<T extends string>(
  prefix: T = "" as T,
  suffix: string = ""
): TypeId<T> {
  if (!isValidPrefix(prefix)) {
    throw new Error("Invalid prefix. Must be at most 63 ascii letters [a-z_]");
  }

  let finalSuffix: string;
  if (suffix) {
    finalSuffix = suffix;
  } else {
    const buffer = new Uint8Array(16);
    v7(undefined, buffer);
    finalSuffix = encode(buffer);
  }

  if (finalSuffix.length !== 26) {
    throw new Error(
      `Invalid length. Suffix should have 26 characters, got ${finalSuffix.length}`
    );
  }

  if (finalSuffix[0] > "7") {
    throw new Error(
      "Invalid suffix. First character must be in the range [0-7]"
    );
  }

  // Validate the suffix by decoding it. If it's invalid, an error will be thrown.
  decode(finalSuffix);

  if (prefix === "") {
    return finalSuffix as TypeId<T>;
  } else {
    return `${prefix}_${finalSuffix}` as TypeId<T>;
  }
}

/**
 * Constructs a TypeId from a string representation, optionally validating against a provided prefix.
 * This function splits the input `typeId` string by an underscore `_` to separate the prefix and suffix.
 * If the `typeId` contains no underscore, it is assumed to be a suffix with an empty prefix.
 * If a `prefix` is provided, it must match the prefix part of the `typeId`, or an error is thrown.
 *
 * @param {string} typeId - The string representation of the TypeId to be parsed.
 * @param {T} [prefix] - An optional prefix to validate against the prefix in the `typeId`.
 * @returns {TypeId<T>} A new TypeId instance constructed from the parsed `typeId`.
 * @throws {Error} If the `typeId` format is invalid, the prefix is empty when there's a separator,
 *                 or there's a prefix mismatch when a `prefix` is provided.
 * @template T - A string literal type that extends string.
 */
export function fromString<T extends string>(
  typeId: string,
  prefix?: T
): TypeId<T> {
  let p;
  let s;

  const underscoreIndex = typeId.lastIndexOf("_");
  if (underscoreIndex === -1) {
    p = "" as T;
    s = typeId;
  } else {
    p = typeId.substring(0, underscoreIndex) as T;
    s = typeId.substring(underscoreIndex + 1);

    if (!p) {
      throw new Error(
        `Invalid TypeId. Prefix cannot be empty when there's a separator: ${typeId}`
      );
    }
  }

  if (!s) {
    throw new Error(`Invalid TypeId. Suffix cannot be empty`);
  }

  if (prefix && p !== prefix) {
    throw new Error(
      `Invalid TypeId. Prefix mismatch. Expected ${prefix}, got ${p}`
    );
  }

  return typeidUnboxed(p, s);
}

/**
 * Parses a TypeId string into its prefix and suffix components.
 *
 * @param {TypeId<T>} typeId - The TypeId string to parse.
 * @returns {{ prefix: T; suffix: string }} An object containing the prefix and suffix of the TypeId.
 * @throws {Error} If the TypeId format is invalid (not exactly two parts separated by an underscore).
 *
 * @example
 * // For a valid TypeId 'example_00041061050r3gg28a1c60t3gf'
 * const { prefix, suffix } = parseTypeId('example_00041061050r3gg28a1c60t3gf');
 * console.log(prefix); // 'example'
 * console.log(suffix); // '00041061050r3gg28a1c60t3gf'
 *
 * @example
 * // Throws an error for invalid TypeId format
 * try {
 *   parseTypeId('invalidTypeId');
 * } catch (error) {
 *   console.error(error.message); // 'Invalid TypeId format: invalidTypeId'
 * }
 */
export function parseTypeId<T extends string>(
  typeId: TypeId<T>
): { prefix: T; suffix: string } {
  return { prefix: getType(typeId), suffix: getSuffix(typeId) };
}

/**
 * Retrieves the prefix from a TypeId.
 *
 * @param {TypeId<T>} typeId - The TypeId from which to extract the prefix.
 * @returns {T} The prefix of the TypeId.
 */
export function getType<T extends string>(typeId: TypeId<T>): T {
  const underscoreIndex = typeId.lastIndexOf("_");
  if (underscoreIndex === -1) {
    return "" as T;
  }
  return typeId.substring(0, underscoreIndex) as T;
}

/**
 * Retrieves the suffix from a TypeId.
 *
 * @param {TypeId<T>} typeId - The TypeId from which to extract the suffix.
 * @returns {string} The suffix of the TypeId.
 */
export function getSuffix<T extends string>(typeId: TypeId<T>): string {
  const underscoreIndex = typeId.lastIndexOf("_");
  if (underscoreIndex === -1) {
    return typeId;
  }
  return typeId.substring(underscoreIndex + 1);
}

export function toUUIDBytes<T extends string>(typeId: TypeId<T>): Uint8Array {
  return decode(getSuffix(typeId));
}

export function toUUID<T extends string>(typeId: TypeId<T>) {
  return stringify(toUUIDBytes(typeId));
}

export function fromUUIDBytes(
  prefix: string,
  bytes: Uint8Array
): TypeId<typeof prefix> {
  const suffix = encode(bytes);
  return prefix
    ? (`${prefix}_${suffix}` as TypeId<typeof prefix>)
    : (suffix as TypeId<typeof prefix>);
}

export function fromUUID<T extends string>(
  uuid: string,
  prefix?: T
): TypeId<T> {
  const suffix = encode(parseUUID(uuid));
  return prefix ? (`${prefix}_${suffix}` as TypeId<T>) : (suffix as TypeId<T>);
}

import { uuidv7obj, UUID } from "uuidv7";
import { parseUUID } from "./parse_uuid";
import { encode, decode } from "./base32";

function isValidPrefix(str: string): boolean {
  if (str.length > 63) {
    return false;
  }

  let code; let i; let len;

  for (i = 0, len = str.length; i < len; i += 1) {
    code = str.charCodeAt(i);
    if (!(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

export class TypeID<const T extends string> {
  constructor(private prefix: T, private suffix: string = "") {
    if (!isValidPrefix(prefix)) {
      throw new Error("Invalid prefix. Must be at most 63 ascii letters [a-z]");
    }
    this.prefix = prefix;

    if (suffix) {
      this.suffix = suffix;
    } else {
      const uuid = uuidv7obj();
      this.suffix = encode(uuid.bytes);
    }

    if (this.suffix.length !== 26) {
      throw new Error(`Invalid length. Suffix should have 26 characters, got ${suffix.length}`);
    }

    if (this.suffix[0] > "7") {
      throw new Error("Invalid suffix. First character must be in the range [0-7]");
    }

    // Validate the suffix by decoding it. If it's invalid, an error will be thrown.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unused = decode(this.suffix);
  }

  public getType(): T {
    return this.prefix;
  }

  public getSuffix(): string {
    return this.suffix;
  }

  public asType<const U extends string>(prefix: U): TypeID<U> {
    const self = this as unknown as TypeID<U>;
    if (self.prefix !== prefix) {
      throw new Error(`Cannot convert TypeID of type ${self.prefix} to type ${prefix}`);
    }
    return self;
  }

  public toUUIDBytes(): Uint8Array {
    return decode(this.suffix);
  }

  public toUUID(): string {
    const uuid = UUID.ofInner(this.toUUIDBytes());
    return uuid.toString();
  }

  public toString(): string {
    if (this.prefix === "") {
      return this.suffix;
    }
    return `${this.prefix}_${this.suffix}`;
  }

  static fromString<const T extends string>(str: string): TypeID<T> {
    const parts = str.split("_");
    if (parts.length === 1) {
      return new TypeID<T>("" as T, parts[0]);
    }
    if (parts.length === 2) {
      if (parts[0] === "") {
        throw new Error(`Invalid TypeID. Prefix cannot be empty when there's a separator: ${str}`);
      }
      return new TypeID<T>(parts[0] as T, parts[1]);
    }
    throw new Error(`Invalid TypeID string: ${str}`);
  }

  static fromUUIDBytes<const T extends string>(prefix: T, bytes: Uint8Array): TypeID<T> {
    const suffix = encode(bytes);
    return new TypeID(prefix, suffix);
  }

  static fromUUID<const T extends string>(prefix: T, uuid: string): TypeID<T> {
    const suffix = encode(parseUUID(uuid));
    return new TypeID(prefix, suffix);
  }
}

export function typeid<T extends string>(): TypeID<''>;
export function typeid<T extends string>(prefix: T): TypeID<T>;
export function typeid<T extends string>(prefix: T, suffix: string): TypeID<T>;
export function typeid<T extends string>(prefix: T = "" as T, suffix: string = ""): TypeID<T> {
  return new TypeID(prefix, suffix);
}

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

export class TypeID {
  constructor(private prefix: string = "", private suffix: string = "") {
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

    // Validate the suffix by decoding it. If it's invalid, an error will be thrown.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unused = decode(this.suffix);
  }

  public getType(): string {
    return this.prefix;
  }

  public getSuffix(): string {
    return this.suffix;
  }

  public toUUIDBytes(): Uint8Array {
    return decode(this.suffix);
  }

  public toUUID(): string {
    const uuid = new UUID(this.toUUIDBytes());
    return uuid.toString();
  }

  public toString(): string {
    if (this.prefix === "") {
      return this.suffix;
    }
    return `${this.prefix}_${this.suffix}`;
  }

  static fromString(str: string): TypeID {
    const parts = str.split("_");
    if (parts.length === 1) {
      return new TypeID("", parts[0]);
    }
    if (parts.length === 2) {
      if (parts[0] === "") {
        throw new Error(`Invalid TypeID. Prefix cannot be empty when there's a separator: ${str}`);
      }
      return new TypeID(parts[0], parts[1]);
    }
    throw new Error(`Invalid TypeID string: ${str}`);
  }

  static fromUUIDBytes(prefix: string = "", bytes: Uint8Array = new Uint8Array(16)): TypeID {
    const suffix = encode(bytes);
    return new TypeID(prefix, suffix);
  }

  static fromUUID(prefix: string = "", uuid: string = ""): TypeID {
    const suffix = encode(parseUUID(uuid));
    return new TypeID(prefix, suffix);
  }
}

export const typeid = (prefix: string = "", suffix: string = "") => new TypeID(prefix, suffix);
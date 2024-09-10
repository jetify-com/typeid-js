import { stringify } from "uuid";
import { parseUUID } from "./parse_uuid";
import { encode, decode } from "./base32";
import {
  typeidUnboxed,
  getSuffix,
  getType,
  fromString,
} from "./unboxed/typeid";

export class TypeID<const T extends string> {
  constructor(private prefix: T, private suffix: string = "") {
    const typeIdRaw = typeidUnboxed(prefix, suffix);

    this.prefix = getType(typeIdRaw);
    this.suffix = getSuffix(typeIdRaw);
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
      throw new Error(
        `Cannot convert TypeID of type ${self.prefix} to type ${prefix}`
      );
    }
    return self;
  }

  public toUUIDBytes(): Uint8Array {
    return decode(this.suffix);
  }

  public toUUID(): string {
    return stringify(this.toUUIDBytes());
  }

  public toString(): `${T}_${string}` | string {
    if (this.prefix === "") {
      return this.suffix;
    }
    return `${this.prefix}_${this.suffix}`;
  }

  static fromString<const T extends string>(
    str: string,
    prefix?: T
  ): TypeID<T> {
    const typeIdRaw = fromString(str, prefix);

    return new TypeID<T>(getType(typeIdRaw) as T, getSuffix(typeIdRaw));
  }

  static fromUUIDBytes<const T extends string>(
    prefix: T,
    bytes: Uint8Array
  ): TypeID<T> {
    const suffix = encode(bytes);
    return new TypeID(prefix, suffix);
  }

  static fromUUID<const T extends string>(prefix: T, uuid: string): TypeID<T> {
    const suffix = encode(parseUUID(uuid));
    return new TypeID(prefix, suffix);
  }
}

export function typeid<T extends string>(): TypeID<"">;
export function typeid<T extends string>(prefix: T): TypeID<T>;
export function typeid<T extends string>(prefix: T, suffix: string): TypeID<T>;
export function typeid<T extends string>(
  prefix: T = "" as T,
  suffix: string = ""
): TypeID<T> {
  return new TypeID(prefix, suffix);
}

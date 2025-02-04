export class InvalidPrefixError extends Error {
  constructor(prefix: string) {
    super(`Invalid prefix "${prefix}". Must be at most 63 ASCII letters [a-z_]`);
    this.name = "InvalidPrefixError";
  }
}

export class PrefixMismatchError extends Error {
  constructor(expected: string, actual: string) {
    super(`Invalid TypeId. Prefix mismatch. Expected ${expected}, got ${actual}`);
    this.name = "PrefixMismatchError";
  }
}

export class EmptyPrefixError extends Error {
  constructor(typeId: string) {
    super(`Invalid TypeId. Prefix cannot be empty when there's a separator: ${typeId}`);
    this.name = "EmptyPrefixError";
  }
}

export class InvalidSuffixLengthError extends Error {
  constructor(length: number) {
    super(`Invalid length. Suffix should have 26 characters, got ${length}`);
    this.name = "InvalidSuffixLengthError";
  }
}

export class InvalidSuffixCharacterError extends Error {
  constructor(firstChar: string) {
    super(`Invalid suffix. First character "${firstChar}" must be in the range [0-7]`);
    this.name = "InvalidSuffixCharacterError";
  }
}

export class TypeIDConversionError extends Error {
  constructor(actualPrefix: string, expectedPrefix: string) {
    super(`Cannot convert TypeID of type ${actualPrefix} to type ${expectedPrefix}`);
    this.name = "TypeIDConversionError";
  }
}

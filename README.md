# Official TypeID-JS Package
### JavaScript implementation of [TypeIDs](https://github.com/jetpack-io/typeid) using TypeScript.

TypeIDs are a modern, **type-safe**, globally unique identifier based on the upcoming
UUIDv7 standard. They provide a ton of nice properties that make them a great choice
as the primary identifiers for your data in a database, APIs, and distributed systems.
Read more about TypeIDs in their [spec](https://github.com/jetpack-io/typeid).

This is the official JavaScript / TypeScript implementation of TypeID by the
[jetpack.io](https://jetpack.io) team. It provides an npm package that can be used by
any JavaScript or TypeScript project.

# Installation

Using npm:
```bash
npm install typeid-js
```

Using yarn:
```bash
yarn add typeid-js
```

Using pnpm:
```bash
pnpm add typeid-js
```

# Usage
To create a random TypeID of a given type, use the `typeid()` function:

```typescript
import { typeid } from 'typeid-js';
const tid = typeid("prefix");
```

The prefix is optional, so if you need to create an id with a type prefix, you
can do that too:

```typescript
import { typeid } from 'typeid-js';
const tid = typeid();
```

In addition to the `typeid()` function, there's also a `TypeID` class that can
be used to encode/decode from other formats.

For example, to parse an existing typeid from a string:
```typescript
import { TypeID } from 'typeid-js';

const tid = TypeID.fromString("prefix_00041061050r3gg28a1c60t3gf");
```

To encode an existing UUID as a TypeID:
```typescript
import { TypeID } from 'typeid-js';

const tid = TypeID.fromUUID("prefix", "00000000-0000-0000-0000-000000000000");
```

The full list of methods includes:
+ `getType()`: Returns the type of the type prefix
+ `getSuffix()`: Returns uuid suffix in its base32 representation
+ `toString()`: Encodes the object as a string, using the canonical format
+ `toUUID()`: Decodes the TypeID into a UUID string in hex format. The type prefix is ignored
+ `toUUIDBytes()`: Decodes the TypeID into a UUID byte array. The type prefix is ignored
+ `fromString(str)`: Parses a TypeID from a string
+ `fromUUID(prefix, uuid)`: Creates a TypeID from a prefix and a UUID in hex format
+ `fromUUIDBytes(prefix, bytes)`: Creates a TypeID from a prefix and a UUID in byte array format

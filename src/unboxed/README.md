# typeid-unboxed

### An unboxed TypeScript implementation of [TypeIDs](https://github.com/jetify-com/typeid), using strings for runtime representation.

In addition to the class implementation of TypeID (which uses class instances at runtime), we incorporated [typeid-unboxed](https://github.com/ozanmakes/typeid-unboxed) source code that utilizes strings in runtime while achieving type safety through branded types. This implementation offers a lightweight and flexible approach that does not require serialization and de-serialization steps.

The `TypeID` class uses unboxed `TypeId` under the hood. If you wish to use a string-based representation of TypeID, we recommend you importing the underlying unboxed functions directly. Note that the `TypeID` class is different from the `TypeId` unboxed type, and it is preferred to stick to one versus the other throughout your application.

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

To create a random TypeId of a given type, use the `typeidUnboxed()` function:

```typescript
import { typeidUnboxed } from 'typeid-js';
const tid = typeidUnboxed('prefix');
```

The prefix is optional, so if you need to create an id without a type prefix, you
can do that too:

```typescript
import { typeidUnboxed } from 'typeid-js';
const tid = typeidUnboxed();
```

The return type of `typeidUnboxed("prefix")` is `TypeId<"prefix">`, which lets you use
TypeScript's type checking to ensure you are passing the correct type prefix to
functions that expect it.

For example, you can create a function that only accepts TypeIds of type `user`:

```typescript
import { typeidUnboxed, TypeId } from 'typeid-js';

function doSomethingWithUserID(id: TypeId<'user'>) {
    // ...
}
```

In addition to the `typeidUnboxed()` function, `TypeId` has additional methods
to encode/decode from other formats.

For example, to parse an existing typeid from a string:

```typescript
import { fromString } from 'typeid-js';

// The second argument is optional, but it converts to type TypeID<"prefix"> instead
// of TypeID<string>
const tid = fromString('prefix_00041061050r3gg28a1c60t3gf', 'prefix');
```

To encode an existing UUID as a TypeId:

```typescript
import { fromUUID } from 'typeid-js';

// In this case TypeID<"prefix"> is inferred from the second argument
const tid = fromUUID('00000000-0000-0000-0000-000000000000', 'prefix');
```

The full list of exported functions includes:

-   `typeidUnboxed(prefix?, suffix?)`: Creates a TypeId with an optional prefix and suffix.
-   `fromString(typeId, prefix?)`: Parses a TypeId from a string, optionally validating against a provided prefix.
-   `parseTypeId(typeId)`: Parses a TypeId string into its prefix and suffix components.
-   `getType(typeId)`: Retrieves the prefix from a TypeId.
-   `getSuffix(typeId)`: Retrieves the suffix from a TypeId.
-   `toUUID(typeId)`: Decodes the TypeId into a UUID string in hex format. The type prefix is ignored.
-   `toUUIDBytes(typeId)`: Decodes the TypeId into a UUID byte array. The type prefix is ignored.
-   `fromUUID(uuid, prefix?)`: Creates a TypeId from a UUID in hex format, with an optional prefix.
-   `fromUUIDBytes(prefix, bytes)`: Creates a TypeId from a prefix and a UUID in byte array format.

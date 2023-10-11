# Artia.db

![GitHub License](https://img.shields.io/badge/license-ISC-blue.svg)

Artia.db is a lightweight and efficient database library for Node.js.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [JavaScript Example](#javascript-example)
  - [TypeScript Example](#typescript-example)
- [API Reference](#api-reference)
  - [Constructor](#constructor)
  - [findUnique](#findunique)
  - [deleteUnique](#deleteunique)
  - [update](#update)
  - [findMany](#findmany)
  - [deleteMany](#deletemany)
  - [create](#create)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install Artia.db via npm:

```bash
npm install artia.db
```

# Usage

## JavaScript Example

```js
const { NoSQLDatabase } = require("artia.db");

const db = new NoSQLDatabase("mydata.json");

const newItem = {
  name: "John",
  age: 30,
};

db.create({ create: newItem });
const foundItem = db.findUnique({ where: { name: "John" } });
console.log(foundItem);
```

## TypeScript Example

```ts
import { NoSQLDatabase } from "artia.db";

const db = new NoSQLDatabase("mydata.json");

const newItem = {
  name: "John",
  age: 30,
};

db.create({ create: newItem });
const foundItem = db.findUnique({ where: { name: "John" } });
console.log(foundItem);
```

# API Reference

## Constructor

- `NoSQLDatabase(fileName: string)`

#### Creates a new instance of the database.

## findUnique

- `findUnique({ where: { field: value } }): T | null`

#### Finds a unique item in the database based on the specified criteria.

- `where`: An object with criteria to match for finding the item.

## deleteUnique

- `deleteUnique({ where: { field: value } }): boolean`

#### Deletes a unique item from the database based on the specified criteria.

- `where`: An object with criteria to match for deleting the item.

## update

- `update({ where: { field: value }, data: { field: value } }): T | null`

#### Updates an item in the database based on the specified criteria and new data.

- `where`: An object with criteria to match for updating the item.
- `data`: An object with new data to update the item.

## findMany

- `findMany({ where: { field: value } }): T[]`

#### Finds multiple items in the database based on the specified criteria.

- `where`: An object with criteria to match for finding multiple items.

# deleteMany

`deleteMany({ where: { field: value } }): number`

#### Deletes multiple items from the database based on the specified criteria.

- `where`: An object with criteria to match for deleting multiple items.

## create
`create({ create: T }): T`
#### Creates a new item and adds it to the database.

- `create`: An object with data for creating a new item.

## Contributing
Feel free to contribute to this project! Please follow our Contribution Guidelines.

## License
This project is licensed under the ISC License. See the LICENSE file for details.
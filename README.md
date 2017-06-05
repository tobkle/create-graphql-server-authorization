# create-graphql-server-authorization

[![Build Status](https://travis-ci.org/tobkle/create-graphql-server-authorization.svg?branch=master)](https://travis-ci.org/tobkle/create-graphql-server-authorization) [![Coverage Status](https://coveralls.io/repos/github/tobkle/create-graphql-server-authorization/badge.svg?branch=master)](https://coveralls.io/github/tobkle/create-graphql-server-authorization?branch=master)

--UNDER CONSTRUCTION--

Authorization for create-graphql-server with Command Line Interface and API.

If you are using create-grapqhl-server, you come to a point, when you need some kind of authorization on types and fields in your GraphQL schema. This package provides a library to do authorization checks.

## Installation
```bash
npm install create-graphql-server-authorization
```

It provides Authorization checks for
* document type authorization
* field authorization

It relays on the Api of the create-graphql-server type system e.g.:
```javascript
type User
@authorize(
  admin: ["create", "read", "update", "delete"],
  this: ["readOne", "update", "delete"]
)
{
  username: String!
  role: String! @authorize(this: ["readOne", "update", "delete"], admin: ["create", "read", "update", "delete"])
  bio: String!
}
```

## Usage

### Command Line Interface:
It provides a parser to read type files.
It provides a generator to create authorization code files.
```bash
cgs-auth --parse /path/to/type-file.graphql --generate /path/to/authorization-check-type.js
```

### Application Programming Interface (API)
It provides an API, which you can call in your create-graphql-server projects to do authorization checks.

```javascript
const checkAuthorization = require('create-graphql-server-authorization');
checkAuthorization('User', require('./path/to/authorization-check-type'));
```

## Tests
```bash
npm test
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


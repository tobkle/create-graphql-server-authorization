[![npm version](https://badge.fury.io/js/create-graphql-server-authorization.svg)](http://badge.fury.io/js/create-graphql-server-authorization) [![Build Status](https://travis-ci.org/tobkle/create-graphql-server-authorization.svg?branch=master)](https://travis-ci.org/tobkle/create-graphql-server-authorization) [![Coverage Status](https://coveralls.io/repos/github/tobkle/create-graphql-server-authorization/badge.svg?branch=master)](https://coveralls.io/github/tobkle/create-graphql-server-authorization?branch=master)

# create-graphql-server-authorization

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
  role: String! 
  bio: String!
}
```

## Usage


## Tests
```bash
yarn test
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


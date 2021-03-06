[![npm version](https://badge.fury.io/js/create-graphql-server-authorization.svg)](http://badge.fury.io/js/create-graphql-server-authorization) [![Build Status](https://travis-ci.org/tobkle/create-graphql-server-authorization.svg?branch=master)](https://travis-ci.org/tobkle/create-graphql-server-authorization) [![Coverage Status](https://coveralls.io/repos/github/tobkle/create-graphql-server-authorization/badge.svg?branch=master)](https://coveralls.io/github/tobkle/create-graphql-server-authorization?branch=master)

# create-graphql-server-authorization

Adds Authorization Logic to the GraphQL-Server-Generator: **create-graphql-server**.

If you are using create-grapqhl-server, you come to a point, when you need some kind of authorization on your GraphQL server. This package provides a possible way to do authorization checks.

Therefore it enhances the type schema with two additional GraphQL directives:
* @authorize
* @authRole

Use these two directives in your GraphQL type definitions. Then use the ```create-graphql-server add-type <your-type>``` command to generate the according GraphQL server code with already injected generated authorization logic code.

## Usage
It provides Authorization checks for type authorization.

It adds the two GraphQL directives @authorize and @authRole to the create-graphql-server type system e.g.:
```javascript
type User
@authorize(
  admin: ["create", "read", "update", "delete"],
  this: ["readOne", "update", "delete"]
)
{
  username: String!
  role: String! @authRole(for: ["admin"]) 
  bio: String!
}
```

The type "User" is treated as a special type. It adds automatically the input field "password" and "createdBy" and "updatedBy" fields.

## Installation
```bash
git clone git@github.com:tmeasday/create-graphql-server.git
cd create-graphql-server
yarn add create-graphql-server-authorization
```

Add it to the generator files here:
* generate/index.js
* generate/model/index.js
* generate/resolver/index.js

In "generate/schema/index.js"
```javascript
import {
  enhanceSchemaForAuthorization
} from 'create-graphql-server-authorization';
...
...
...
  // at the end: enhance with Authorization
  const outputSchemaWithAuth = enhanceSchemaForAuthorization(outputSchema);

  return outputSchemaWithAuth;
}
```

In "generate/model/index.js"
```javascript
import { print } from 'recast';
import { templateToAst } from '../util/read';
import getCode from '../util/getCode';
import { MODEL } from '../util/constants';
import { modulePath } from 'create-graphql-server-authorization';  // <=== here

export default function generateModel(inputSchema) {
  const ast = generateModelAst(inputSchema);
  return print(ast, { trailingComma: true }).code;
}

export function generateModelAst(inputSchema) {

  const templateCode = getCode(MODEL, {
    inputSchema,
    basePath: [__dirname, 'templates'],
    authPath: [modulePath, 'templates', 'model', 'auth']   // <=== here
  });

  // validate syntax of generated template code
  const replacements = {};
  const ast = templateToAst(templateCode, replacements);

  return ast;
}

```

In "generate/resolver/index.js"
```javascript
 import { print } from 'recast';
 import getCode from '../util/getCode';
 import { templateToAst } from '../util/read';
 import { RESOLVER } from '../util/constants';
 import { modulePath } from 'create-graphql-server-authorization';   // <=== here

export default function generateResolvers(inputSchema) {
  const ast = generateResolversAst(inputSchema)
  return print(ast, { trailingComma: true }).code;
}

export function generateResolversAst(inputSchema) {
  const templateCode = getCode(RESOLVER, {
    inputSchema,
    basePath: [__dirname, 'templates'],
    authPath: [modulePath, 'templates','resolver', 'auth']   // <=== here
  });

  // validate syntax of generated template code
  const replacements = {};
  const ast = templateToAst(templateCode, replacements);

  return ast;
}


```

## Documentation
[API Documentation](https://tobkle.github.io/create-graphql-server-authorization/)

## Tests
```bash
yarn test
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


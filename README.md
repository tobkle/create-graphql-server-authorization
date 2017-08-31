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

## Installation
```bash
git clone git@github.com:tmeasday/create-graphql-server.git
cd create-graphql-server
yarn add create-graphql-server-authorization
```

Add it to the generator files here:
* generate/model/index.js [Mandatory]
* generate/resolver/index.js [Mandatory]
* generate/schema/index.js [Optional]

In the Model generator you can use it, to generate authorization code which is then injected in the Model methods of the types:
```javascript
import { getCode } from 'create-graphql-server-authorization';
...

...
```

Additional references for this module **create-graphql-server-authorization** in the create-graphql-server are here:
* /skel/server/authenticate.js [uses: findByIds]
* /skel/server/index.js [uses: getLogFilename, logger]

So if you are replacing **create-graphql-server-authorization** by your own forked version of this module, please don't forget the other two references, or just keep the original version in your package.json.

### Option
In the Schema generator you can use it as an option for example, to generate two fields createdBy and updatedBy only if there is a user type and authorization setup:
```javascript 
import { isAuthorizeDirectiveDefined } from 'create-graphql-server-authorization';
...
const authorize = isAuthorizeDirectiveDefined(outputSchema);
...
// for safety reasons:
// only with @authorize we know that there is a "User" type defined
if (authorize){
  type.fields.push(buildField('createdBy', [], 'User'));
  type.fields.push(buildField('updatedBy', [], 'User'));
}
...
```

## Documentation
[API Documentation](https://tobkle.github.io/create-graphql-server-authorization/)

## Tests
```bash
yarn test
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


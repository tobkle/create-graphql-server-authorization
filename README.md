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
* generate/schema/index.js [Optional]

In the Model generator you can use it, to generate authorization code which is then injected in the Model methods of the types:
```javascript
import { generateAuthorizationCode } from 'create-graphql-server-authorization';
...
export function generateModelAst(inputSchema) {
  const type = inputSchema.definitions[0];
  const TypeName = type.name.value;
  const typeName = lcFirst(TypeName);

  const ast = generators.base({ 
    TypeName,
    typeName,
    ...generateAuthorizationCode( typeName, inputSchema )
  });

  ...
}
...
```

It generates authorization code for the following **tags**...
* generateAuthCodeModeReadOne
* generateAuthCodeModeReadMany
* generateAuthCodeModeCreate
* generateAuthCodeModeUpdate
* generateAuthCodeModeDelete
* generateCreatedBy
* generateUpdatedBy
* generateAuthRoleDefinition
* generateAuthRoleMethod

Insert those tags at the appropriate places in the /generate/model/templates/... files.

For example:
If you want to use authorization logic in the update mutation: Add the tag **generateAuthCodeModeUpdate** into the /generate/model/templates/base.js.template file like so:

```javascript
...
import { findByIds, queryForRoles, getLogFilename, logger, authlog, checkAuthDoc, protectFields } from 'create-graphql-server-authorization';
...

async updateById(id, doc, me, resolver) {
  try {
    let docToUpdate = {$set: Object.assign({}, doc, {
          updatedAt: Date.now(),
          updatedById: (me && me._id) ? me._id : 'unknown',
    })};
    const baseQuery = {_id: id};

	// here at this location:
    generateAuthCodeModeUpdate

    const result = await this.collection.updateOne(finalQuery, docToUpdate);
    if (result.result.ok !== 1 || result.result.n !== 1){
      throw new Error(`update typeName not possible for ${id}.`);
    }
    log.debug(`updated typeName ${id}.`);
    this.authorizedLoader.clear(id);
    const updatedDoc = this.findOneById(id, me, 'pubsub typeNameUpdated');
    this.pubsub.publish('typeNameUpdated', updatedDoc);
    return updatedDoc;
  } catch (err) { log.error(err.message); }
}

...
```

Here is a complete example file for generate/model/templates/base.js.template:
```javascript
import DataLoader from 'dataloader';
import { findByIds, queryForRoles, getLogFilename, logger, authlog, checkAuthDoc, protectFields } from 'create-graphql-server-authorization';
const log = logger(getLogFilename());

export default class TypeName {
  constructor(context) {
    this.context = context;
    this.collection = context.db.collection('typeName');
    this.pubsub = context.pubsub;generateAuthRoleDefinition
    const that = this;
    try {
      generateAuthCodeModeReadOne
    } catch (err) { log.error(err.message); }
  }
  generateAuthRoleMethod
  async findOneById(id, me, resolver) {
    try {
      if (!this.authorizedLoader) return null;
      return await this.authorizedLoader.load(id);
    } catch (err) { log.error(err.message); }
  }

  find({ lastCreatedAt = 0, limit = 10, baseQuery = {} }, me, resolver) {
    try {
      generateAuthCodeModeReadMany
      return this.collection.find(finalQuery).sort({ createdAt: 1 }).limit(limit).toArray();
    } catch (err) { log.error(err.message); }
  }

  generateCreatedBy

  generateUpdatedBy

  async insert(doc, me, resolver) {
    try {
      let docToInsert = Object.assign({}, doc, {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdById: (me && me._id) ? me._id : 'unknown',
        updatedById: (me && me._id) ? me._id : 'unknown',
      });
      generateAuthCodeModeCreate
      const id = (await this.collection.insertOne(docToInsert)).insertedId;
      if (!id) {
        throw new Error(`insert typeName not possible.`);
      }
      log.debug(`inserted typeName ${id}.`);
      const insertedDoc = this.findOneById(id, me, 'pubsub typeNameInserted');
      this.pubsub.publish('typeNameInserted', insertedDoc);
      return insertedDoc;
    } catch (err) { log.error(err.message); }
  }

  async updateById(id, doc, me, resolver) {
    try {
      let docToUpdate = {$set: Object.assign({}, doc, {
            updatedAt: Date.now(),
            updatedById: (me && me._id) ? me._id : 'unknown',
      })};
      const baseQuery = {_id: id};
      generateAuthCodeModeUpdate
      const result = await this.collection.updateOne(finalQuery, docToUpdate);
      if (result.result.ok !== 1 || result.result.n !== 1){
        throw new Error(`update typeName not possible for ${id}.`);
      }
      log.debug(`updated typeName ${id}.`);
      this.authorizedLoader.clear(id);
      const updatedDoc = this.findOneById(id, me, 'pubsub typeNameUpdated');
      this.pubsub.publish('typeNameUpdated', updatedDoc);
      return updatedDoc;
    } catch (err) { log.error(err.message); }
  }

  async removeById(id, me, resolver) {
    try {
      const baseQuery = {_id: id};
      generateAuthCodeModeDelete
      const result = await this.collection.remove(finalQuery);
      if (result.result.ok !== 1 || result.result.n !== 1){
        throw new Error(`remove typeName not possible for ${id}.`);
      }
      log.debug(`removed typeName ${id}.`);
      this.authorizedLoader.clear(id);
      this.pubsub.publish('typeNameRemoved', id);
      return result;
    } catch (err) { log.error(err.message); }
  }

}
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
(API Documentation)[https://tobkle.github.io/create-graphql-server-authorization/]

## Tests
```bash
npm run test
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


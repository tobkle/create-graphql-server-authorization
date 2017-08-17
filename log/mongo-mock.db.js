var ObjectID = require('bson-objectid');

module.exports = {
  "localhost:27017": {
    "databases": {
      "myproject": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              },
              {
                "name": "user"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": [
              {
                "v": 1,
                "key": {
                  "_id": 1
                },
                "ns": "myproject.user",
                "name": "_id_",
                "unique": true
              }
            ]
          },
          {
            "name": "user",
            "documents": [
              {
                "_id": ObjectID("583291a1638566b3c5a92ca0"),
                "username": "tmeasday"
              },
              {
                "_id": ObjectID("583291a1638566b3c5a92ca1"),
                "username": "stubailo"
              },
              {
                "_id": ObjectID("583291a1638566b3c5a92ca2"),
                "username": "lacker"
              }
            ]
          }
        ]
      }
    }
  }
}
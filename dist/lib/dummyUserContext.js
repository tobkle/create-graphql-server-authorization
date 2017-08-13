"use strict";

// mocking User authRole, as it is not existing in this library
// for usage in the test cases, where we don't have an original User model context
var dummyUserContext = {
  authRole: function authRole(user) {
    return user && user.role ? user.role : null;
  }
};

module.exports = dummyUserContext;
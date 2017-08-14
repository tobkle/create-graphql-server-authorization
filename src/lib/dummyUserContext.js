/*
 * Returns a dummyUserContext
 * mocking User authRole, as it is not existing in this library
 * for usage in the test cases, where we don't have an original 
 * User model context
 * @return {object} dummyUserContext
 */
export const dummyUserContext = {
  authRole(user) {
    return user && user.role ? user.role : null;
  }
};

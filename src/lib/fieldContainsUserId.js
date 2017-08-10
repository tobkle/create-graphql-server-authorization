import _ from "lodash";

/**
 * checks, if a field contains a user's id
 * @param {string, array} docRoleField
 * @param {object} userId
 * @return {boolean} foundUserId
 */

// returns true, if a field of type array/object/string contains the userId
export default function fieldContainsUserId(docRoleField, userId) {
  let found = false;

  // empty userId is not a valid userId
  if (userId.toString() === "") return false;

  // handle a simple id field
  if (docRoleField.toString() === userId.toString()) {
    return true;
  }

  // handle an array
  if (_.isArray(docRoleField)) {
    docRoleField.every(field => {
      if (fieldContainsUserId(field, userId)) {
        found = true;
        return true;
      }
    });
    if (found) return true;
  }

  // handle an object
  if (_.isObject(docRoleField)) {
    Object.keys(docRoleField).every(field => {
      // handle a field
      if (
        docRoleField[field] &&
        docRoleField[field].toString() === userId.toString()
      ) {
        found = true;
        return true;
      }

      // handle an array
      if (_.isArray(docRoleField[field])) {
        docRoleField[field].every(innerField => {
          if (fieldContainsUserId(innerField, userId)) {
            found = true;
            return true;
          }
        });
        if (found) return true;
      }

      // handle an object
      if (_.isObject(docRoleField[field])) {
        Object.keys(docRoleField[field]).every(innerField => {
          if (fieldContainsUserId(docRoleField[field][innerField], userId)) {
            found = true;
            return true;
          }
        });
        if (found) return true;
      }
    });
  }
  return found;
}

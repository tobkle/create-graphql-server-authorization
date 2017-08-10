/**
 * Checks if an user is logged in
 * @param {object} me
 * @return {boolean} loggedIn
 */

export default function loggedIn(me) {
  if (me && me._id && me._id.toString() !== "") {
    return true;
  }
  return false;
}

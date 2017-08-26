// @flow

/*
 * @desc Checks, if an user is logged in
 * @param {object} me - current user
 * @return {boolean} loggedIn - true, if user is logged in
 */

export function loggedIn(me: any): boolean {
  if (me && me._id && me._id.toString() !== '') {
    return true;
  }
  return false;
}

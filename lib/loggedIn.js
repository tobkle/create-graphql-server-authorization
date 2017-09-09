'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loggedIn = loggedIn;


/**
 * Checks, if an user is logged in
 * @param {object} me - current user
 * @return {boolean} loggedIn - true, if user is logged in
 */

function loggedIn(me) {
  if (me && me._id && me._id.toString() !== '') {
    return true;
  }
  return false;
}
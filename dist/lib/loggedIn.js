"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loggedIn;
/**
 * Checks if an user is logged in
 * @param {object} me
 * @return {boolean} loggedIn
 */

function loggedIn(me) {
  if (me && me._id && me._id.toString() !== "") {
    return true;
  }
  return false;
}
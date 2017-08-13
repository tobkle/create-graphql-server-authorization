"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * find a record by id (cached with dataloader)
 * returns the record, cached if already read, checks authorization if set
 * enhancement of tmeasday'findByIds
 * @param {string, array} docRoleField
 * @param {object} userId
 * @return {boolean} foundUserId
 */
function findByIds(collection) {
  var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var authQuery = arguments[2];

  var baseQuery = { _id: { $in: ids } };
  var finalQuery = _extends({}, baseQuery, authQuery);
  return collection.find(finalQuery).toArray().then(function (docs) {
    var idMap = {};
    docs.forEach(function (d) {
      idMap[d._id] = d;
    });
    return ids.map(function (id) {
      return idMap[id];
    });
  });
}

module.exports = findByIds;
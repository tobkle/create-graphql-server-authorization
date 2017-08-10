/**
 * find a record by id (cached with dataloader)
 * returns the record, cached if already read, checks authorization if set
 * enhancement of tmeasday'findByIds
 * @param {string, array} docRoleField
 * @param {object} userId
 * @return {boolean} foundUserId
 */

export default function findByIds(collection, ids = [], authQuery) {
  const baseQuery = { _id: { $in: ids } };
  const finalQuery = { ...baseQuery, ...authQuery };
  return collection.find(finalQuery).toArray().then(docs => {
    const idMap = {};
    docs.forEach(d => {
      idMap[d._id] = d;
    });
    return ids.map(id => idMap[id]);
  });
}

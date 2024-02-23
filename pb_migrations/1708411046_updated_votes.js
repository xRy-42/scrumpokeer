/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cjdd58pd2sbwvbi")

  collection.createRule = "user.id = @request.auth.id // can only create for yourself"
  collection.deleteRule = "user.id = @request.auth.id // can only delete for yourself"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cjdd58pd2sbwvbi")

  collection.createRule = "user.id = @request.auth.id"
  collection.deleteRule = "user.id = @request.auth.id"

  return dao.saveCollection(collection)
})

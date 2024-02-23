/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cjdd58pd2sbwvbi")

  collection.listRule = "user.id = @request.auth.id || \n@collection.tables.participants.id ?= user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cjdd58pd2sbwvbi")

  collection.listRule = null

  return dao.saveCollection(collection)
})

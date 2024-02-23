/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cjdd58pd2sbwvbi")

  collection.listRule = "user.id = @request.auth.id || \n(@collection.tables.participants.id ?= @request.auth.id)"
  collection.viewRule = "user.id = @request.auth.id || \n(@collection.tables.participants.id ?= @request.auth.id)"
  collection.createRule = "user.id = @request.auth.id"
  collection.updateRule = "user.id = @request.auth.id || \n(@collection.tables.participants.id ?= @request.auth.id)"
  collection.deleteRule = "user.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cjdd58pd2sbwvbi")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.listRule = null
  collection.viewRule = "id = @request.auth.id || \n@collection.tables.participants.id ?= id\n// other users of shared tables need to view your username"
  collection.updateRule = "id = @request.auth.id // only you can update"
  collection.deleteRule = "id = @request.auth.id // only you can delete - cant currently"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.listRule = "id = @request.auth.id"
  collection.viewRule = "id = @request.auth.id || \n@collection.tables.participants.id ?= id"
  collection.updateRule = "id = @request.auth.id"
  collection.deleteRule = "id = @request.auth.id"

  return dao.saveCollection(collection)
})

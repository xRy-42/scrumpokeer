/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  collection.listRule = "participants.id ?= @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  collection.listRule = "@request.auth.id != \"\" && participants.id ?= @request.auth.id"

  return dao.saveCollection(collection)
})

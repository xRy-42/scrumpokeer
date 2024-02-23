/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9cftbkli0h3x4il")

  collection.listRule = "@request.auth.id != \"\" && users.id ?= @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9cftbkli0h3x4il")

  collection.listRule = ""

  return dao.saveCollection(collection)
})

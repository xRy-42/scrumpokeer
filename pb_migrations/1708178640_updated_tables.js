/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  collection.updateRule = "@request.auth.id != \"\" // add lock mechanism"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  collection.updateRule = null

  return dao.saveCollection(collection)
})

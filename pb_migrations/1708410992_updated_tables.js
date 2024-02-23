/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  collection.viewRule = "@request.auth.id != \"\" // everybody should be able to join"
  collection.createRule = "@request.auth.id != \"\" // everybody should be able to create"
  collection.deleteRule = "participants.id ?= @request.auth.id && \nparticipants:length = 1 \n// last participant can delete"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  collection.viewRule = "@request.auth.id != \"\""
  collection.createRule = "@request.auth.id != \"\""
  collection.deleteRule = "participants.id ?= @request.auth.id"

  return dao.saveCollection(collection)
})

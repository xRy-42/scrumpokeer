/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  collection.updateRule = "@request.auth.id != \"\" // everybody should be able to join // add lock mechanism"
  collection.deleteRule = "participants.id ?= @request.auth.id && \nparticipants:length = 1 \n// only last participant can delete"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  collection.updateRule = "@request.auth.id != \"\" // add lock mechanism"
  collection.deleteRule = "participants.id ?= @request.auth.id && \nparticipants:length = 1 \n// last participant can delete"

  return dao.saveCollection(collection)
})

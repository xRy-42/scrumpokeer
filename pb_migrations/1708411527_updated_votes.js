/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cjdd58pd2sbwvbi")

  collection.listRule = "user.id = @request.auth.id || \n@collection.tables.participants.id ?= user.id\n// shared table users can see your vote"
  collection.viewRule = "user.id = @request.auth.id || \n@collection.tables.participants.id ?= user.id\n// shared table users can see your vote"
  collection.updateRule = "user.id = @request.auth.id || \n(@collection.tables.participants.id ?= user.id && @request.data.vote = '')\n// everyone needs to reset your vote"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cjdd58pd2sbwvbi")

  collection.listRule = "user.id = @request.auth.id || \n@collection.tables.participants.id ?= user.id"
  collection.viewRule = "user.id = @request.auth.id || \n@collection.tables.participants.id ?= user.id"
  collection.updateRule = ""

  return dao.saveCollection(collection)
})

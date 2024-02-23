/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.listRule = "id = @request.auth.id || \n(@collection.table_user:user.users ?= @request.auth.id && @collection.table_user:user.users ?= id )"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.listRule = "id = @request.auth.id || \n(@collection.table_user.users ?= @request.auth.id && @collection.table_user.users ?= id )"

  return dao.saveCollection(collection)
})

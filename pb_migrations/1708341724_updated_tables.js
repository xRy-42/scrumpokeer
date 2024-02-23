/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1uearhvq",
    "name": "reveal",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9")

  // remove
  collection.schema.removeField("1uearhvq")

  return dao.saveCollection(collection)
})

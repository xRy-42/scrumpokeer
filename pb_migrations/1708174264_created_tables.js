/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "hu0kk25058hw0v9",
    "created": "2024-02-17 12:51:04.501Z",
    "updated": "2024-02-17 12:51:04.501Z",
    "name": "tables",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "8busfuos",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "yktbcxio",
        "name": "options",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("hu0kk25058hw0v9");

  return dao.deleteCollection(collection);
})

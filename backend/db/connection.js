/**
 * @typedef {admin.firestore.CollectionReference<admin.firestore.DocumentData, admin.firestore.DocumentData>} CollectionType
 */

const admin = require("firebase-admin");
const keys = require("../keys.json");

admin.initializeApp({
    credential: admin.credential.cert(keys)
});

const project = admin.firestore();

/** @type {CollectionKind[]} */
const collectionNames = [ "users", "products", "sales" ];

/**
 * @typedef {"users" | "products" | "sales"} CollectionKind
 */

/**
 * @type { { [key in CollectionKind]: CollectionType } }
 */
const collections = Object.fromEntries(collectionNames.map(collectionName => [ collectionName, project.collection(collectionName) ]));

module.exports = collections;

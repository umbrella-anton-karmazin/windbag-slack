'use strict';

const Datastore = require('nedb');
const dbs = {};

/**
 *
 * @param filename
 * @param options
 * @returns Datastore
 */
module.exports = (filename, options) => {
    if (!dbs[filename]) {
        const params = Object.assign({filename}, options);

        const db = new Datastore(params);
        db.loadDatabase();

        dbs[filename] = db;
    }
    return dbs[filename];
};

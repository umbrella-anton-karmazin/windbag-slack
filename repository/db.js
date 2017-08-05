'use strict';

const Datastore = require('nedb');

/**
 *
 * @param filename
 * @param options
 * @returns Datastore
 */
module.exports = (filename, options) => {
    const params = Object.assign({filename}, options);

    const db = new Datastore(params);
    db.loadDatabase();

    return db;
};

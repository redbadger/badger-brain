'use strict'; // eslint-disable-line strict
const backup = require('../lib');
const env = require('../config/env.json');

module.exports.backupPrismic = (event, context, cb) => {
  backup(env.bucketName)
    .then(metadata => cb(null, metadata))
    .catch(err => cb(err));
};

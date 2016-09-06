'use strict';
const backup = require('../lib');

module.exports.backupPrismic = (event, context, cb) => {
  cb(null, {
    hello: "world",
  })
  // backup()
  //   .then(metadata => cb(null, metadata))
  //   .catch(err => cb(err, null));
};

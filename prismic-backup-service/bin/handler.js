'use strict'; // eslint-disable-line strict
const backup = require('../lib');
const variables = require('../config/variables.json');

const environment = (cb, functionName) => {
  switch (functionName) {
    case 'prismic-backup-service-dev-backupPrismic':
      return variables.dev;
    case 'prismic-backup-service-prod-backupPrismic':
      return variables.prod;
    default:
      return cb('Unable to determine environment.');
  }
};

module.exports.backupPrismic = (event, context, cb) => {
  const env = environment(cb, context.functionName);
  backup(env.bucketName)
    .then(metadata => cb(null, metadata))
    .catch(err => cb(err));
};

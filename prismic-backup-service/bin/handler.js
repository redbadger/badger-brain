'use strict'; // eslint-disable-line strict
const backup = require('../lib');
const variables = require('../config/variables.json');

const environment = (cb, functionName) => {
  switch (functionName) {
    case 'prismic-backup-service-dev-BackupPrismic':
      return variables.dev;
    case 'prismic-backup-service-prod-BackupPrismic':
      return variables.prod;
    default:
      return null;
  }
};

module.exports.backupPrismic = (event, context, cb) => {
  const env = environment(cb, context.functionName);
  if (!env) {
    cb(new Error('Unable to determine environment.'));
  } else {
    backup(env.bucketName)
      .then(metadata => cb(null, metadata))
      .catch(err => cb(err));
  }
};

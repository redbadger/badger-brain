function saveJson(bucketName, key, data) {
  const AWS = require('aws-sdk'); // eslint-disable-line import/no-unresolved, global-require

  AWS.config.region = 'eu-west-1';

  const s3bucket = new AWS.S3({ params: { Bucket: bucketName } });

  const index = {
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(index, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = { saveJson };

Prismic backup service
============

Lambda that requests documents from prismic and stores the results in an S3 bucket.

```
npm install serverless@1.0.0-rc.1 -g
sls deploy
sls invoke --function backupPrismic
```

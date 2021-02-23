Prismic backup service
============

Lambda that requests documents from prismic and stores the results in an S3 bucket.

```sh
# Install the Serverless CLI
npm install serverless -g

# Set up the dev environment variables
cp config/env.example.json config/env.json
vim config/env.json

# Deploy the stack
sls deploy

# Give it a test
sls invoke --function BackupPrismic

# Delete the stack (if you want to)
sls remove
```

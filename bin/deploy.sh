#!/bin/bash

SHA1=$1
AWS_ACCOUNT=$2

ZIP=staging.zip
REPO_NAME=badger-brain
REPO_URL=$AWS_ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com/$REPO_NAME
EB_BUCKET=elasticbeanstalk-eu-west-1-$AWS_ACCOUNT

# Authenticate
eval $(aws ecr get-login --region=eu-west-1)

# Build Docker image
docker build -t $REPO_NAME .

# Tag and deploy image to ECR
docker tag $REPO_NAME:latest $REPO_URL:$SHA1
docker tag $REPO_NAME:latest $REPO_URL:latest
docker push $REPO_URL

# Apply correct repository and tag to Dockerrun.aws.json
# sed -i '' "s/<REPO_URL>/$REPO_URL/" Dockerrun.aws.json
# sed -i '' "s/<TAG>/$TAG/" Dockerrun.aws.json

# Zip up the Dockerrun file
zip -r $ZIP Dockerrun.aws.json

# Copy Zip file to S3 bucket
aws s3 cp $ZIP s3://$EB_BUCKET/$ZIP

# Create a new application version with the zipped up Dockerrun file
aws elasticbeanstalk create-application-version --application-name $REPO_NAME-staging \
    --version-label staging --source-bundle S3Bucket=$EB_BUCKET,S3Key=$ZIP --region eu-west-1

# Update the environment to use the new application version
aws elasticbeanstalk update-environment --environment-name $REPO_NAME-staging \
      --version-label staging --region eu-west-1

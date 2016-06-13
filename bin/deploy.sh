#!/bin/bash

ENV=$1
SHA1=$2
AWS_ACCOUNT=$3

REPO_NAME=badger-brain
REPO_URL=$AWS_ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com/$REPO_NAME
EB_BUCKET=elasticbeanstalk-eu-west-1-$AWS_ACCOUNT
ZIP=$REPO_NAME-$ENV.zip

# Authenticate
eval $(aws ecr get-login --region=eu-west-1)

# Build Docker image
docker build -t $REPO_NAME .

# Tag and deploy image to ECR
docker tag $REPO_NAME:latest $REPO_URL:$SHA1
docker tag -f $REPO_NAME:latest $REPO_URL:latest
docker push $REPO_URL

# Zip up the Dockerrun file
zip -r $ZIP Dockerrun.aws.json

# Copy Zip file to S3 bucket
aws s3 cp $ZIP s3://$EB_BUCKET/$ZIP

# Create a new application version with the zipped up Dockerrun file
aws elasticbeanstalk create-application-version --application-name $REPO_NAME \
    --version-label latest --source-bundle S3Bucket=$EB_BUCKET,S3Key=$ZIP --region eu-west-1

# Update the environment to use the new application version
aws elasticbeanstalk update-environment --environment-name $REPO_NAME-$ENV \
      --version-label latest --region eu-west-1

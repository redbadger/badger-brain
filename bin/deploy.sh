#!/bin/bash

ENV=$1
BUILD_SHA1=$2
RELEASE_TAG=$3

APP_NAME=badger-brain
AWS_ACCOUNT=578418881509
AWS_REGION=eu-west-1
ECR_REPO=$AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME
EB_BUCKET=elasticbeanstalk-$AWS_REGION-$AWS_ACCOUNT/$APP_NAME

if [ "$ENV" === "production" ]; then
  VERSION=$APP_NAME_$ENV_$RELEASE_TAG
else
  VERSION=$APP_NAME_$ENV
fi

# Authenticate
eval $(aws ecr get-login --region=$AWS_REGION)

# Build, tag and deploy Docker image to ECR
docker build -t $APP_NAME .
docker tag $APP_NAME:$ENV $ECR_REPO:$BUILD_SHA1
docker tag -f $APP_NAME:$ENV $ECR_REPO:$ENV
docker push $ECR_REPO

# Create, zip and upload Dockerrun.aws.json to S3 bucket
node ./bin/create_dockerrun.js $ECR_REPO:$ENV
ZIP_FILE=$VERSION.zip
zip -r $ZIP_FILE Dockerrun.aws.json
aws s3 cp $ZIP_FILE s3://$EB_BUCKET/$ZIP_FILE

# Create a new application version with the zipped up Dockerrun file
aws elasticbeanstalk create-application-version --application-name $APP_NAME \
    --version-label $VERSION --source-bundle S3Bucket=$EB_BUCKET,S3Key=$ZIP_FILE --region $AWS_REGION

# Update the environment to use the new application version
aws elasticbeanstalk update-environment --environment-name $APP_NAME-$ENV \
    --version-label $VERSION --region $AWS_REGION

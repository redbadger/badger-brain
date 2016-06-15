#!/bin/bash

set -e

ENV=$1
BUILD_SHA1=$2
RELEASE_TAG=$3
APP_NAME=badger-brain
AWS_ACCOUNT=578418881509
AWS_REGION=eu-west-1
ECR_REPO=$AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME
EB_BUCKET=elasticbeanstalk-$AWS_REGION-$AWS_ACCOUNT
VERSION=${APP_NAME}-${ENV}

# If we're deploying to production, append the release tag
[[ "$ENV" == "production" ]] && VERSION="${VERSION}-${RELEASE_TAG}"

# Authenticate
eval $(aws ecr get-login --region=$AWS_REGION)

# Build, tag and deploy Docker image to ECR
docker build -t $APP_NAME:$ENV .
docker tag $APP_NAME:$ENV $ECR_REPO:$BUILD_SHA1
docker tag -f $APP_NAME:$ENV $ECR_REPO:$ENV
docker push $ECR_REPO

# Apply docker image path to Dockerrun.aws.json template
sed -i '' -e "s/<ECR_REPO>/$ECR_REPO/" Dockerrun.aws.json
sed -i '' -e "s/<IMAGE>/$APP_NAME/" Dockerrun.aws.json
sed -i '' -e "s/<TAG>/$ENV/" Dockerrun.aws.json

# Zip up Dockerrun.aws.json and upload to S3 bucket
ZIP_FILE=$VERSION.zip
zip -r $ZIP_FILE Dockerrun.aws.json
aws s3 cp $ZIP_FILE s3://$EB_BUCKET/$APP_NAME/$ZIP_FILE

if [ "$ENV" == "production" ]
then
  # Create a new application version with the zipped up Dockerrun file
  aws elasticbeanstalk create-application-version --application-name $APP_NAME \
      --version-label $VERSION --source-bundle S3Bucket=$EB_BUCKET,S3Key=$ZIP_FILE --region $AWS_REGION
fi

# Update the environment to use the new application version
aws elasticbeanstalk update-environment --environment-name $APP_NAME-$ENV \
    --version-label $VERSION --region $AWS_REGION

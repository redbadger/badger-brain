#!/bin/sh

ENV=$1
RELEASE_TAG=$(git rev-parse HEAD)
APP_NAME=badger-brain
AWS_ACCOUNT=578418881509
AWS_REGION=eu-west-1
ECR_REPO=$AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME
EB_BUCKET=elasticbeanstalk-$AWS_REGION-$AWS_ACCOUNT

if [ -z "$ENV" ] || [ -z "$RELEASE_TAG" ]
then
  echo Usage:
  echo "  deploy.sh ENVIRONMENT"
  exit 1
fi

set -eu
set -o pipefail

# Authenticate
eval $(aws ecr get-login --region=$AWS_REGION)

# Build Docker image
VERSION=$RELEASE_TAG
docker build -t $APP_NAME:$RELEASE_TAG .
docker tag $APP_NAME:$RELEASE_TAG $ECR_REPO:$RELEASE_TAG
docker push $ECR_REPO:$RELEASE_TAG

# Apply docker image path to Dockerrun.aws.json template
cp Dockerrun.aws.json.template Dockerrun.aws.json
perl -pi --no-include-email "s,<ECR_REPO>,$ECR_REPO,g" "Dockerrun.aws.json"
perl -pi --no-include-email "s,<TAG>,$VERSION,g" "Dockerrun.aws.json"

# Zip up Dockerrun.aws.json and upload to S3 bucket
ZIP_FILE=$VERSION.zip
zip -r $ZIP_FILE Dockerrun.aws.json
aws s3 cp $ZIP_FILE s3://$EB_BUCKET/$APP_NAME/$ZIP_FILE

# Create a new application version with the zipped up Dockerrun file
aws elasticbeanstalk create-application-version \
  --application-name $APP_NAME \
  --version-label $VERSION \
  --source-bundle S3Bucket=$EB_BUCKET,S3Key=$APP_NAME/$ZIP_FILE \
  --region $AWS_REGION

# Update the environment to use the new application version
aws elasticbeanstalk update-environment \
  --environment-name $APP_NAME-$ENV \
  --version-label $VERSION \
  --region $AWS_REGION

echo
echo Done! AWS EB deployment rollout in progress.

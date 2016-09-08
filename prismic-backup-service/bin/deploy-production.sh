#!/usr/bin/env bash
set -euo pipefail

SERVICE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
ENV_FILE="$SERVICE_DIR/config/env.json"

echo Generating env.json

cat > "$ENV_FILE" << Heredoc
{
  "bucketName": "redbadger-prismic-backup-prod",
  "ErrorSNSSubscriptions": [
    {
      "Endpoint" : "$BADGER_LABS_SLACK_EMAIL",
      "Protocol" : "email"
    },
    {
      "Endpoint" : "$BADGER_LABS_EMAIL",
      "Protocol" : "email"
    }
  ]
}
Heredoc

echo Generated env.json

echo Deploying prismic-backup-service to prod

cd "$SERVICE_DIR"
sls deploy --stage prod

echo Creating new lambda version
aws lambda publish-version \
  --function-name prismic-backup-service-prod-BackupPrismic \
  --region eu-west-1

echo Cleanup
rm "$ENV_FILE"

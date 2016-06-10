#!/bin/bash

SHA1=$1
WEB=578418881509.dkr.ecr.us-east-1.amazonaws.com/badger-brain

# Deploy image to ECR
docker tag badger-brain $WEB:$SHA1
docker tag -f badger-brain $WEB:latest
docker push $WEB

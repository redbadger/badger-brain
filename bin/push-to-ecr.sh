#!/bin/bash

SHA1=$1
ECR=578418881509.dkr.ecr.us-east-1.amazonaws.com/badger-brain

# Deploy image to ECR
docker tag badger-brain:latest $ECR:$SHA1
docker tag -f badger-brain:latest $ECR:latest
docker push $ECR

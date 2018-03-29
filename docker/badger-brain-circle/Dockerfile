FROM node:6.2.1

RUN apt-get update && \
    apt-get install -y \
        libssl-dev \
        python-dev \
        python-pip \
    && pip install --upgrade awsebcli --upgrade --ignore-installed six \
    && apt-get clean

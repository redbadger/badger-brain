FROM node:12.20.1-alpine3.12

ENV NODE_VERSION 12.20.1
# Needed for pip install
RUN apk add --no-cache openssh
# Install aws cli
RUN apk add --no-cache \
        python3 \
        py3-pip \
        groff \
        less \
        mailcap \
        && \
    pip install --upgrade awscli==1.14.5 s3cmd==2.0.1 python-magic && \
    apk -v --purge del py3-pip

# Build dependencies
RUN apk add --no-cache make git zip curl docker perl bash

# Make bash default shell
RUN sed -i -e "s/bin\/ash/bin\/bash/" /etc/passwd


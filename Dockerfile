FROM node:12.16.1-alpine3.10

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# babel (fsevents/node-gyp) needs this
RUN apk add --no-cache \
          make \
          python3 \
          build-base

# Install app dependencies
COPY package*.json /usr/src/app/
RUN npm ci

# Bundle app source
COPY . /usr/src/app

# Build assets
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

EXPOSE 3001

CMD [ "npm", "run", "serve" ]

# This file contains instructions to build an image of fragments microservice

# Stage 0: Install alpine Linux + node (LTS - 18.14.2) + dependencies
FROM node:18.14.2-alpine3.17@sha256:0d2712ac2b2c1149391173de670406f6e3dbdb1b2ba44e8530647e623e0e1b17 AS dependencies

# metadata about the image
LABEL maintainer="Elena Bechmanis <ebechmanis@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Defining environment variables
ENV NODE_ENV=production

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# We default to use port 8080 in our service
ENV PORT=8080

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
# This will create the /app directory, and then enter it, so that all subsequent commands will be relative to /app
# https://docs.docker.com/engine/reference/builder/#workdir
WORKDIR /app

# COPY <src> <dest> copies from the build context (<src>) to a path inside the image
# Copy the package.json and package-lock.json files into the working dir (/app)
# Change ownership to user:group (node:node)
COPY --chown=node:node package*.json /app/

# Install node dependencies defined in package-lock.json
# Replaced --> RUN npm install
# npm ci --production will ignore dev dependencies while installing node modules
RUN npm ci --only=production

#######################################################################################################################

# Stage 1: use dependencies to start the server
FROM node:18.14.2-alpine3.17@sha256:0d2712ac2b2c1149391173de670406f6e3dbdb1b2ba44e8530647e623e0e1b17 AS builder

WORKDIR /app

# Copy cached node modules from previous stage so we don't have to download them again
COPY --chown=node:node --from=dependencies /app/ .

# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# Indicate which user is running commands before the app is run
USER node

# Start the container by running our server
CMD ["node", "server.js"]

# We run our service on port 8080
EXPOSE 8080

# Check the / route every 3 minutes, fail if we don't get a 200
HEALTHCHECK --interval=3m --timeout=30s --start-period=10s --retries=3\
  CMD curl --fail http://localhost:${PORT}/ || exit 1




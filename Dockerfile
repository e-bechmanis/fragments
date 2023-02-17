# This file contains instructions to build an image of fragments microservice

# Use node version 18.13.0
FROM node:18.13.0

# metadata about the image
LABEL maintainer="Elena Bechmanis <ebechmanis@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Defining environment variables
# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
# This will create the /app directory, and then enter it, so that all subsequent commands will be relative to /app
# https://docs.docker.com/engine/reference/builder/#workdir
WORKDIR /app

# COPY <src> <dest> copies from the build context (<src>) to a path inside the image
# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080

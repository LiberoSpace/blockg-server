# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "run", "start:prod" ]

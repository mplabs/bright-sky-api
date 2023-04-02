FROM node:16-alpine

WORKDIR /usr/app

# first copy just the package and the lock file, for caching purposes
COPY package*.json ./

# install dependencies
RUN npm ci

# copy the entire project
COPY . .

# build
RUN npm run build

EXPOSE 3000
ENV PORT 3000
CMD [ "npm", "start" ]

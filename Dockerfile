FROM node:22-alpine
WORKDIR /APP
EXPOSE 3000
COPY . /APP/
COPY package.json .
RUN ls -R
RUN npm i prisma
# RUN npx prisma generate
RUN npm i;
RUN pwd
CMD [ "node", "dist/index.js" ]


FROM node:8.2

ADD . /code
WORKDIR /code
RUN npm install
CMD ["npm", "start"]
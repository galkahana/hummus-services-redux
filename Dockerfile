FROM node:16 as builder

WORKDIR /app
COPY backend/package*.json ./
RUN npm install

FROM builder
ENV PORT 8080
EXPOSE 8080
WORKDIR /app

ADD backend .

CMD ["npm", "start"]

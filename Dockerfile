FROM node:16 as builder

WORKDIR /app
COPY backend/package*.json ./
RUN npm install
ADD backend .
RUN npm run build

FROM node:16
ENV PORT 8080
EXPOSE 8080
WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY --from=builder ./app/dist/src ./dist/src
COPY --from=builder ./app/dist/assets ./dist/assets
COPY --from=builder ./app/dist/scripts ./dist/scripts
# config is required at root. so put it there (rest is as is due to module-aliases)
COPY --from=builder ./app/dist/config ./config

CMD ["npm", "start"]

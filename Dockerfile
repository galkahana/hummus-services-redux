FROM node:16 as frontend_builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
ADD frontend .
RUN npm run build


FROM node:16 as backend_builder

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
RUN npm install --omit=dev

COPY --from=backend_builder ./app/dist/src ./dist/src
COPY --from=backend_builder ./app/dist/assets ./dist/assets
COPY --from=backend_builder ./app/dist/scripts ./dist/scripts
# config is required at root. so put it there (rest is as is due to module-aliases)
COPY --from=backend_builder ./app/dist/config ./config

COPY --from=frontend_builder ./app/build ./dist/frontend-build

CMD ["npm", "start"]

ARG FRONTEND_BUILDER_SOURCE=full
ARG FRONTEND_BUILDER=frontend_builder_${FRONTEND_BUILDER_SOURCE}

FROM node:16 as frontend_builder_none
RUN echo "not serving frontend"
WORKDIR /app
RUN mkdir output

FROM node:16 as frontend_builder_full

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
ADD frontend .
RUN npm run build
RUN mkdir output
RUN mv build output/frontend-build

FROM ${FRONTEND_BUILDER} as selected_frontend_builder

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

COPY --from=selected_frontend_builder ./app/output ./dist/

CMD ["npm", "start"]

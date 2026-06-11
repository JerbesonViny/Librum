FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production=false --frozen-lockfile

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

EXPOSE 3000

CMD ["yarn", "start:dev"]

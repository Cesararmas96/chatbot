FROM node:22-alpine3.19 AS navigator-chatbots
WORKDIR /app
COPY . .
RUN npm install -g pnpm && \
    pnpm install
RUN pnpm run build
RUN rm -f pnpm-lock.yaml && \
    rm -rf src/ static/ docker-compose.yml
CMD ["node", "--max-old-space-size=4096", "build/index.js"]

# ==========================
# Build stage
# ==========================
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ==========================
# Runtime stage
# ==========================
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000

COPY --from=build /app .
CMD ["npm", "run", "start"]

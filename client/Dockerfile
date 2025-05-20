# Stage 1: Build the Angular application
FROM node:20 AS builder
WORKDIR /app

# 1. Copy package manifests & install exact deps
COPY package*.json ./
RUN npm ci

# 2. Copy source and build the sakai-ng project in production mode
COPY . .
RUN npm run build -- --project=sakai-ng --configuration=production

# Stage 2: Serve the production build
FROM node:20 AS runner
WORKDIR /app

# 3. Install a tiny static server
RUN npm install -g serve

# 4. Copy over the built files
COPY --from=builder /app/dist/sakai-ng/browser ./dist

# 5. Expose port 4200 and launch
EXPOSE 4200
CMD ["serve", "-s", "dist", "-l", "4200"]
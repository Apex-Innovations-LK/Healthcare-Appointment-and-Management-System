# Step 1: Use Node.js 20 for the build stage
FROM node:20 AS build

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy dependency files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy rest of the Angular app
COPY . .

# Step 6: Build the Angular app
RUN npm run build

# Step 7: Use lightweight Node runtime to serve the app
FROM node:20 AS runtime

# Step 8: Set working directory
WORKDIR /app

# Step 9: Install static file server
RUN npm install -g http-server

# Step 10: Copy built output from the build stage
COPY --from=build /app/dist/sakai-ng ./dist/sakai-ng

# Step 11: Expose port
EXPOSE 8080

# Step 12: Start the static server from the correct path
CMD ["http-server", "dist/sakai-ng/browser", "-p", "8080"]

# Stage 1: Install dependencies
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Run Angular dev server
CMD ["npm", "run", "start"]

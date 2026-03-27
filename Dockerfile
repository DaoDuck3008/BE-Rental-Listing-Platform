FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port Express runs on
EXPOSE 5000

# Start the application
CMD ["node", "src/server.js"]

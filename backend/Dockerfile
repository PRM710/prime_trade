# Use Node.js LTS image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and lock first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the app in production mode
CMD ["npm", "start"]

# Use Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker build cache
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm ci

# Copy the rest of the backend files
COPY backend/ ./backend/

# Move to the backend folder
WORKDIR /app/backend

# Expose backend port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]

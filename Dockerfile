# Use the official Node.js 14 image.
# If you need a different version of Node.js, replace '14' with your desired version.
FROM node:14-slim

# Set the working directory inside the container
WORKDIR /app

# Copy 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# Install dependencies
# Note: '--no-cache' is used to ensure the latest versions are installed.
RUN npm install --no-cache

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Inform Docker that the container listens on the specified port at runtime.
EXPOSE 3888

# Run the application
CMD ["node", "index.js"]
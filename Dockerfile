FROM ghcr.io/puppeteer/puppeteer:21.5.0

# Switch to root to install dependencies (if any needed, though native image has them)
# Actually, the image runs as 'pptruser' by default. 
# We need to copy files as that user.

USER root
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
# Install deps (ci for clean install)
RUN npm ci

# Copy source code
COPY . .

# Provide write permissions to pptruser for cache if needed (though we used .puppeteerrc.cjs)
# But here we use the installed chrome in the image.
# We need to tell Puppeteer to use the INSTALLED chrome, OR let it download.
# The base image has chrome installed at valid path.
# We should set ENV variables to skip download and use installed chrome.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Switch back to pptruser for security
USER pptruser

# Expose port
ENV PORT=8787
EXPOSE 8787

# Start the server
CMD ["node", "server.js"]

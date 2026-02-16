FROM ghcr.io/puppeteer/puppeteer:21.5.0

# 1. Environment variables FIRST so npm install sees them
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

USER root
WORKDIR /app

# 2. Copy package files
COPY package*.json ./

# 3. Install dependencies (npm install is safer than ci for cross-platform)
# The skip_download env var above ensures we don't download chrome again
RUN npm install

# 4. Copy source code
COPY . .

# 5. Switch back to pptruser for security
USER pptruser

# 6. Start
ENV PORT=8787
EXPOSE 8787
CMD ["node", "server.js"]

FROM node:18-alpine

WORKDIR /app

# Copy package.json & package-lock.json dulu supaya docker cache npm install
COPY package*.json ./

RUN npm install

# Expose port Vite (5173)
EXPOSE 5173

# CMD jalankan dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

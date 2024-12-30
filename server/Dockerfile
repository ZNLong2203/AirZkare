FROM node:22

WORKDIR /usr/src/app

# Copy package and Prisma schema before installing dependencies
COPY package*.json ./
COPY prisma ./prisma

RUN npm install

# Copy the remaining application code
COPY . .

# Build the application
RUN npm run build

EXPOSE 2222
CMD ["npm", "run", "start"]

# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your Nest.js application will run on
EXPOSE 5000

# Command to run your Nest.js application
CMD ["npm", "run", "start:prod"]

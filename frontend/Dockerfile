# Use a Node.js base image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy everything else from the frontend directory into the container
COPY . .

# Expose the port that the Expo web app will run on
EXPOSE 3000

RUN ls -al

# Command to start the Expo web app
CMD ["npm", "run", "web"]





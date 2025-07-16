// utils/generateDockerfile.js
const fs = require("fs").promises;
const path = require("path");

async function generateDockerfile(localPath, analysis) {
    const { language, entryPoint } = analysis;

    let dockerfileContent = "";
    let dockerignoreContent = `.git
node_modules
__pycache__
*.pyc
.DS_Store
.env
`;

    if (language === "Node.js") {
        dockerfileContent = `# Use official Node.js image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;
    } else if (language === "Python") {
        dockerfileContent = `# Use official Python image
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "${entryPoint || "main.py"}"]
`;
    } else {
        dockerfileContent = `# Base image (update as needed)
FROM ubuntu:latest

WORKDIR /app

COPY . .

CMD ["echo", "TODO: Add commands to run your application"]
`;
    }

    // Write Dockerfile
    const dockerfilePath = path.join(localPath, "Dockerfile");
    await fs.writeFile(dockerfilePath, dockerfileContent, "utf-8");

    // Write .dockerignore
    const dockerignorePath = path.join(localPath, ".dockerignore");
    await fs.writeFile(dockerignorePath, dockerignoreContent, "utf-8");

    return {
        dockerfilePath,
        dockerignorePath,
        dockerfileContent
    };
}

module.exports = { generateDockerfile };

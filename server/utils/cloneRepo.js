// utils/cloneRepo.js
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

function cloneRepo(repoUrl) {
    return new Promise((resolve, reject) => {
        // Where to store cloned repos
        const CLONE_DIR = process.env.CLONE_DIR || 'cloned_repos';

        // Absolute path to the clone dir
        const basePath = path.join(__dirname, '../..', CLONE_DIR);

        // Make sure the directory exists
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }

        // Unique folder for this clone
        const targetDir = path.join(basePath, `repo_${Date.now()}`);

        // Build the git clone command
        const cloneCommand = `git clone ${repoUrl} "${targetDir}"`;

        console.log(`Cloning repository to: ${targetDir}`);

        exec(cloneCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Clone failed: ${stderr}`);
                return reject(error);
            }
            console.log(`Clone successful:\n${stdout}`);
            resolve(targetDir);
        });
    });
}

module.exports = { cloneRepo };

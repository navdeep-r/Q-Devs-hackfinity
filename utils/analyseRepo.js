// utils/analyzeRepo.js
const fs = require('fs').promises;
const path = require('path');

async function analyzeRepo(localPath) {
    const result = {
        language: null,
        hasPackageJson: false,
        hasRequirementsTxt: false,
        hasDockerfile: false,
        hasReadme: false,
        startScript: null,
        dependencies: [],
        suggestions: []
    };

    try {
        // Check for package.json
        const pkgJsonPath = path.join(localPath, 'package.json');
        try {
            const pkgJsonContent = await fs.readFile(pkgJsonPath, 'utf-8');
            const pkgJson = JSON.parse(pkgJsonContent);
            result.hasPackageJson = true;
            result.language = 'Node.js';
            result.startScript = pkgJson.scripts?.start || null;
            result.dependencies = Object.keys(pkgJson.dependencies || {});

            if (!result.startScript) {
                result.suggestions.push('Consider adding a "start" script to package.json.');
            }
        } catch {
            // Not Node.js or no package.json
        }

        // Check for requirements.txt (Python)
        const reqsPath = path.join(localPath, 'requirements.txt');
        try {
            await fs.access(reqsPath);
            result.hasRequirementsTxt = true;
            if (!result.language) result.language = 'Python';
        } catch {
            // No requirements.txt
        }

        // Check for Dockerfile
        const dockerfilePath = path.join(localPath, 'Dockerfile');
        try {
            await fs.access(dockerfilePath);
            result.hasDockerfile = true;
        } catch {
            // No Dockerfile
        }

        // Check for README.md
        const readmePath = path.join(localPath, 'README.md');
        try {
            await fs.access(readmePath);
            result.hasReadme = true;
        } catch {
            result.suggestions.push('Consider adding a README.md file.');
        }

        if (!result.language) {
            result.language = 'Unknown';
        }

        // If no Dockerfile
        if (!result.hasDockerfile) {
            result.suggestions.push('Consider adding a Dockerfile.');
        }

    } catch (error) {
        console.error('Error analyzing repository:', error);
        throw error;
    }

    return result;
}

module.exports = { analyzeRepo };

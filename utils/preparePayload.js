const fs = require("fs");
const path = require("path");
const { getRepoTree } = require("./getRepoTree");

/**
 * Prepares a prompt for TogetherAI by loading `.md` files from a repo.
 * @param {string} repoPath - The path to the cloned repo.
 * @param {Array} files - Array of file objects (with .path property).
 * @returns {Object} { systemPrompt, userPrompt }
 */

/**
 * Get a text tree of the repo folder structure.
 * @param {string} repoPath
 */

function preparePayload(repoPath, markdownFiles) {
    let combinedContent = "";

    console.log(markdownFiles)
    for (const file of markdownFiles) {
        try {
            const fileContent = fs.readFileSync(file.path, "utf-8");
            combinedContent += `\n\n# File: ${path.basename(file.path)}\n\n${fileContent.trim()}`;
        } catch (err) {
            console.warn(`❌ Failed to read ${file.path}:`, err.message);
        }
    }

    combinedContent += `\n\n# File Structure:\n\n${getRepoTree(repoPath)}`;

    console.log(getRepoTree(repoPath))

    const systemPrompt = `You are an expert open-source documentation generator. Your job is to analyze the given Markdown files and produce a clean, complete, production-quality README.md file for the project.`;

    const userPrompt = `
Below are the contents of Markdown documentation files from a project and the basic tree structure:

${combinedContent}

---

📝 Based on the above, generate a complete README.md in Markdown format. If something is missing, add a short [TODO] placeholder. Structure it using sections like:

- Project Title
- Overview
- Installation
- Usage
- Development
- Testing
- Docker (if applicable)
- Configuration
- Contributing
- License
`;

    return {
        systemPrompt,
        userPrompt
    };
}

module.exports = { preparePayload };
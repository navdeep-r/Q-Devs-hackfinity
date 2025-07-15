// utils/prepareLLMPayload.js
const path = require("path");

/**
 * Prepares file metadata (path + filename) for LLM analysis.
 * @param {string} repoPath - The base path of the cloned repository.
 * @param {Array} files - Array of file metadata from analyzeRepo().
 * @returns {Object} - { prompt: string, files: Array<{ path, filename }> }
 */
function prepareLLMPayload(repoPath, files) {
    const fileMetadata = files.map(file => ({
        path: file.path,
        filename: path.basename(file.path)
    }));

    const prompt = `
You are an expert software architect and documentation generator.
I am providing you metadata about files in a cloned repository.
For each file, you will request its content in a separate retrieval step or specify what you need. 
Pay attention to comments and README, it is important for figuring out the direction of developement.

Using this metadata, please:
1. Describe what files are likely the most important for project understanding.
2. Suggest an order for reviewing these files to create documentation.
3. Prepare a plan to generate:
   - A README.md
   - A Dockerfile
   - Dependancy Analysis
   - Config files (environment files)
   - Recommendations for improving the project
4. When ready, specify which files' contents you need next.

Files provided:
${fileMetadata.map(f => `- ${f.path}`).join("\n")}
`;

    return {
        prompt,
        files: fileMetadata
    };
}

module.exports = { prepareLLMPayload };

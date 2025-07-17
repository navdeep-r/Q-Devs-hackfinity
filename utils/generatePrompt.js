const { getRepoTree } = require('../utils/getRepoTree');

function generatePrompts(fileContents, localPath) {

    const systemPrompt = `You are an expert software architect and documentation generator.
Use the provided files to generate a clear, production-ready README.md in Markdown format.`;

    let userPrompt = `**Files and their contents:**\n\n`;
    for (const [filePath, content] of Object.entries(fileContents)) {
        const safeContent = typeof content === "string" ? content.trim() : String(content);
        userPrompt += `### ${filePath}\n\n\`\`\`\n${safeContent}\n\`\`\`\n\n`;
    }

    userPrompt += `\n\n# File Structure:\n\n${getRepoTree(localPath)}`;

    userPrompt += `**Instructions:**
Based on the above files, produce a README.md with:
- Title
- Overview
- Installation
- Usage
- Development
- Folder Layout
- Testing
- Docker (if applicable)
- Configuration
- Contributing
- License

If any information is missing, insert minimal TODO notes.
Return only the README.md in your response.`;

    return [systemPrompt, userPromptprompt]
}

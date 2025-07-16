const express = require("express");
const { cloneRepo } = require("../utils/clonerepo");
const { analyzeRepo } = require("../utils/analyseREADME");
const { preparePayload } = require("../utils/preparePayload");
const { callTogether } = require("../utils/callTogether");
const fs = require("fs").promises;
const path = require("path");
const { getRepoTree } = require("../utils/getRepoTree");

const router = express.Router();
const extToLang = {
    ".py": "Python",
    ".js": "JavaScript",
    ".ts": "TypeScript",
    ".json": "JSON",
    ".java": "Java",
    ".c": "C",
    ".cpp": "C++",
    ".cs": "C#",
    ".go": "Go",
    ".rb": "Ruby",
    ".php": "PHP",
    ".rs": "Rust",
    ".sh": "Shell",
    ".html": "HTML",
    ".css": "CSS"
    // Add more as needed
};


let security = true;

async function checkEnvFiles(dir) {
    const ignoredDirs = new Set([
        ".git",
        "node_modules",
        ".next",
        ".cache",
        "venv",
        "__pycache__",
        "dist",
        "build"
    ]);

    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (ignoredDirs.has(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await checkEnvFiles(fullPath);
        } else {
            if (entry.name.endsWith(".env")) {
                security = false;
            }
        }
    }
}

router.post("/clone", async (req, res) => {
    const { repoUrl } = req.body;
    if (!repoUrl)
        return res.status(400).json({ error: "Repository URL is required." });

    try {
        // Step 1: Clone
        const localPath = await cloneRepo(repoUrl);

        // Step 2: Analyze files
        const analysis = await analyzeRepo(localPath);

        // Step 3: Read contents of ALL files you want
        const fileContents = {};
        for (const file of analysis.files) {
            const relPath = file.path;
            try {
                const absPath = path.join(localPath, relPath);
                const data = await fs.readFile(absPath, "utf-8");
                fileContents[relPath] = data;
            } catch (err) {
                fileContents[relPath] = `Error reading file: ${err.message}`;
            }
        }

        // Additionally, if it's a Node app and has an entry point:
        if (analysis.language === "Node.js" && analysis.entryPoint) {
            const entryPath = path.join(localPath, analysis.entryPoint);
            try {
                const entryContent = await fs.readFile(entryPath, "utf-8");
                fileContents[analysis.entryPoint] = entryContent;
            } catch (err) {
                fileContents[analysis.entryPoint] = `Error reading entry point: ${err.message}`;
            }
        }

        // Uncomment to see all collected file contents
        // console.log("=== File Contents ===");
        // console.log(fileContents);

        // Step 4: Prepare single prompt
        const systemPrompt = `You are an expert software architect and documentation generator.
Use the provided files to generate a clear, production-ready README.md in Markdown format.`;

        let userPrompt = `**Files and their contents:**\n\n`;
        // console.log("=== FILE CONTENTS KEYS ===");
        // console.log(Object.keys(fileContents));

        for (const [filePath, content] of Object.entries(fileContents)) {
            const safeContent = typeof content === "string" ? content.trim() : String(content);
            userPrompt += `### ${filePath}\n\n\`\`\`\n${safeContent}\n\`\`\`\n\n`;
        }

        userPrompt += `\n\n# File Structure:\n\n${getRepoTree(localPath)}`;

        userPrompt += `**Instructions:**\n
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

        // Uncomment to inspect prompt
        // console.log("=== System Prompt ===");
        // console.log(systemPrompt);
        // console.log("=== User Prompt ===");
        // console.log(userPrompt);

        // Step 5: Call Together AI
        const readme = await callTogether(systemPrompt, userPrompt);

        // Uncomment to inspect README
        console.log("=== Generated README ===");
        console.log(readme);

        // Step 6: Respond
        checkEnvFiles(localPath);

        res.json({
            message: "Repository processed and README generated successfully.",
            localPath,
            analysis,
            fileContents,
            readme,
            dependancies: {
                techStack: (analysis.techStack).map(([ext, count]) => [extToLang[ext], count]),
                security
            }
        });
    } catch (err) {
        console.error("Error during cloning and analysis:", err);
        res.status(500).json({ error: "Failed to process repository." });
    }
});

module.exports = router;
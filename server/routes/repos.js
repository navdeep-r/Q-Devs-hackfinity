const express = require("express");
const { cloneRepo } = require("../utils/clonerepo");
const { analyzeRepo } = require("../utils/analyserepo");
const { callTogether } = require("../utils/callTogether");
const { generateDockerfile } = require("../utils/generateDockerFile");
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
}

// Any file extension considered code
const codeExtensions = new Set(Object.keys(extToLang));

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
            const found = await checkEnvFiles(fullPath);
            if (found === false) return false;
        } else {
            if (entry.name.endsWith(".env")) {
                return false;
            }
        }
    }
    return true;
}

router.post("/clone", async (req, res) => {
    const { repoUrl } = req.body;
    if (!repoUrl)
        return res.status(400).json({ error: "Repository URL is required." });

    try {
        // Step 1: Clone
        const localPath = await cloneRepo(repoUrl);

        // Step 2: Analyze
        const analysis = await analyzeRepo(localPath);

        // Step 3: Read selected files
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

        if (analysis.language === "Node.js" && analysis.entryPoint) {
            const entryPath = path.join(localPath, analysis.entryPoint);
            try {
                const entryContent = await fs.readFile(entryPath, "utf-8");
                fileContents[analysis.entryPoint] = entryContent;
            } catch (err) {
                fileContents[analysis.entryPoint] = `Error reading entry point: ${err.message}`;
            }
        }

        // Step 4: Prepare prompt
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

        // Step 5: Call Together AI
        const readme = await callTogether(systemPrompt, userPrompt);

        console.log("=== Generated README ===");
        console.log(readme);

        // Step 6: Check for .env
        const security = await checkEnvFiles(localPath);

        // Step 7: Conditionally write README.md
        if (security && !analysis.hasReadme) {
            const readmePath = path.join(localPath, "README.md");
            await fs.writeFile(readmePath, readme, "utf-8");
            console.log(`✅ README.md written to ${readmePath}`);
        } else if (!security) {
            console.log("⚠️ Skipping README write due to .env file detected.");
        } else {
            console.log("ℹ️ README.md already exists; skipping write.");
        }

        // Step 8: Determine whether to generate Dockerfile
        const hasCode = analysis.techStack.some(([ext, count]) => codeExtensions.has(ext) && count > 0);

        let dockerfileInfo = null;
        if (
            security &&
            !analysis.hasDockerfile &&
            hasCode &&
            ["Node.js", "Python"].includes(analysis.language)
        ) {
            dockerfileInfo = await generateDockerfile(localPath, analysis);
            console.log(`✅ Dockerfile generated at ${dockerfileInfo.dockerfilePath}`);
        } else if (!security) {
            console.log("⚠️ Skipping Dockerfile generation due to .env file detected.");
        } else if (analysis.hasDockerfile) {
            console.log("ℹ️ Dockerfile already exists; skipping generation.");
        } else if (!hasCode) {
            console.log("ℹ️ No code detected; skipping Dockerfile generation.");
        } else {
            console.log(`ℹ️ Generating Basic generation for language: ${analysis.language}`);
            dockerfileInfo = await generateDockerfile(localPath, analysis);
        }

        // Step 9: Respond
        res.json({
            message: "Repository processed and README/Dockerfile generated successfully.",
            localPath,
            analysis,
            fileContents,
            readme,
            dockerFile: dockerfileInfo ? dockerfileInfo.dockerfileContent : null,
            dependancies: {
                techStack: analysis.techStack.map(([ext, count]) => [extToLang[ext], count]),
                security
            }
        });
    } catch (err) {
        console.error("Error during cloning and analysis:", err);
        res.status(500).json({ error: "Failed to process repository." });
    }
});

module.exports = router;

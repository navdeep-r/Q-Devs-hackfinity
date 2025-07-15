// // utils/analyzeRepo.js
// const fs = require('fs').promises;
// const path = require('path');

// async function analyzeRepo(localPath) {
//     const result = {
//         language: null,
//         hasPackageJson: false,
//         hasRequirementsTxt: false,
//         hasDockerfile: false,
//         hasReadme: false,
//         startScript: null,
//         dependencies: [],
//         suggestions: []
//     };

//     try {
//         // Check for package.json
//         const pkgJsonPath = path.join(localPath, 'package.json');
//         try {
//             const pkgJsonContent = await fs.readFile(pkgJsonPath, 'utf-8');
//             const pkgJson = JSON.parse(pkgJsonContent);
//             result.hasPackageJson = true;
//             result.language = 'Node.js';
//             result.startScript = pkgJson.scripts?.start || null;
//             result.dependencies = Object.keys(pkgJson.dependencies || {});

//             if (!result.startScript) {
//                 result.suggestions.push('Consider adding a "start" script to package.json.');
//             }
//         } catch {
//             // Not Node.js or no package.json
//         }

//         // Check for requirements.txt (Python)
//         const reqsPath = path.join(localPath, 'requirements.txt');
//         try {
//             await fs.access(reqsPath);
//             result.hasRequirementsTxt = true;
//             if (!result.language) result.language = 'Python';
//         } catch {
//             // No requirements.txt
//         }

//         // Check for Dockerfile
//         const dockerfilePath = path.join(localPath, 'Dockerfile');
//         try {
//             await fs.access(dockerfilePath);
//             result.hasDockerfile = true;
//         } catch {
//             // No Dockerfile
//         }

//         // Check for README.md
//         const readmePath = path.join(localPath, 'README.md');
//         try {
//             await fs.access(readmePath);
//             result.hasReadme = true;
//         } catch {
//             result.suggestions.push('Consider adding a README.md file.');
//         }

//         if (!result.language) {
//             result.language = 'Unknown';
//         }

//         // If no Dockerfile
//         if (!result.hasDockerfile) {
//             result.suggestions.push('Consider adding a Dockerfile.');
//         }

//     } catch (error) {
//         console.error('Error analyzing repository:', error);
//         throw error;
//     }

//     return result;
// }

// module.exports = { analyzeRepo };

// utils/analyzeRepo.js
const fs = require("fs").promises;
const path = require("path");

async function walkDir(dir, baseDir = "", pattern = null) {
    const results = [];

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
        if (ignoredDirs.has(entry.name)) {
            continue; // skip this folder and its children
        }

        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(baseDir, entry.name);

        if (entry.isDirectory()) {
            const subResults = await walkDir(fullPath, relPath, pattern);
            results.push(...subResults);
        } else {
            if (pattern && pattern.test(entry.name.split('/').at(-1))) continue;
            //     const stat = await fs.stat(fullPath);

            // Determine file type based on extension
            // const ext = path.extname(entry.name).toLowerCase();
            // let type = "unknown";
            // if (ext === ".js") type = "javascript";
            // else if (ext === ".ts") type = "typescript";
            // else if (ext === ".py") type = "python";
            // else if (ext === ".json") type = "json";
            // else if (ext === ".yml" || ext === ".yaml") type = "yaml";
            // else if (ext === ".md") type = "markdown";
            // else if (ext === ".dockerfile" || entry.name.toLowerCase() === "dockerfile") type = "dockerfile";
            // else if (ext === ".sh") type = "shell";
            // else if (ext === ".html") type = "html";
            // else if (ext === ".css") type = "css";
            // else if (ext === ".txt") type = "text";

            results.push({
                path: relPath,   // e.g. "src/app.js"
                // size: stat.size,
                // type: type
            });
        }
    }

    return results;
}


async function analyzeRepo(localPath) {
    const result = {
        language: null,
        hasPackageJson: false,
        hasRequirementsTxt: false,
        hasDockerfile: false,
        hasReadme: false,
        startScript: null,
        dependencies: [],
        suggestions: [],
        files: [], // New
    };

    try {
        // Collect all files recursively
        result.files = await walkDir(localPath, "", /^(package\.json|.*\.md)$/);

        // Check for package.json
        const pkgJsonPath = path.join(localPath, "package.json");
        try {
            const pkgJsonContent = await fs.readFile(pkgJsonPath, "utf-8");
            const pkgJson = JSON.parse(pkgJsonContent);
            result.hasPackageJson = true;
            result.language = "Node.js";
            result.startScript = pkgJson.scripts?.start || null;
            result.dependencies = Object.keys(pkgJson.dependencies || {});

            if (!result.startScript) {
                result.suggestions.push('Consider adding a "start" script to package.json.');
            }
        } catch {
            // Not Node.js or no package.json
        }

        // requirements.txt
        const reqsPath = path.join(localPath, "requirements.txt");
        try {
            await fs.access(reqsPath);
            result.hasRequirementsTxt = true;
            if (!result.language) result.language = "Python";
        } catch { }

        // Dockerfile
        const dockerfilePath = path.join(localPath, "Dockerfile");
        try {
            await fs.access(dockerfilePath);
            result.hasDockerfile = true;
        } catch { }

        // README.md
        const readmePath = path.join(localPath, "README.md");
        try {
            await fs.access(readmePath);
            result.hasReadme = true;
        } catch {
            result.suggestions.push("Consider adding a README.md file.");
        }

        if (!result.language) {
            result.language = "Unknown";
        }

        if (!result.hasDockerfile) {
            result.suggestions.push("Consider adding a Dockerfile.");
        }

    } catch (error) {
        console.error("Error analyzing repository:", error);
        throw error;
    }

    console.log(result)

    return result;
}

module.exports = { analyzeRepo };

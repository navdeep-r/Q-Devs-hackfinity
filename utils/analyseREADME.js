const fs = require("fs").promises;
const path = require("path");

async function walkDirByLines(dir, baseDir = "", allowedExts = ['.py', '.js', '.ts', '.json', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php', '.rs', '.sh', '.html', '.css']) {
    const extStats = {}; // { ".js": 123, ".py": 543, ... }
    const ignoredDirs = new Set([".git", "node_modules", ".next", ".cache", "venv", "__pycache__", "dist", "build"]);

    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (ignoredDirs.has(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const subExtStats = await walkDirByLines(fullPath, path.join(baseDir, entry.name), allowedExts);
            for (const [ext, count] of Object.entries(subExtStats)) {
                extStats[ext] = (extStats[ext] || 0) + count;
            }
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (!allowedExts.includes(ext)) continue;

            try {
                const content = await fs.readFile(fullPath, "utf-8");
                const lines = content.split(/\r?\n/).length;
                extStats[ext] = (extStats[ext] || 0) + lines;
            } catch (err) {
                console.warn(`Could not read ${fullPath}: ${err.message}`);
            }
        }
    }

    return extStats;
}

async function walkDir(dir, baseDir = "", pattern = null) {
    const results = [];
    const ignoredDirs = new Set([".git", "node_modules", ".next", ".cache", "venv", "__pycache__", "dist", "build"]);
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (ignoredDirs.has(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(baseDir, entry.name);

        if (entry.isDirectory()) {
            const subResults = await walkDir(fullPath, relPath, pattern);
            results.push(...subResults);
        } else {
            if (!pattern.test(entry.name)) continue;
            results.push({ path: relPath });
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
        entryPoint: null, // ADD THIS
        dependencies: [],
        suggestions: [],
        files: [],
    };

    try {
        // Collect all files
        result.files = await walkDir(localPath, "", /^(package\.json|.*\.md)$/);
        result.techStack = Object.entries(await walkDirByLines(localPath, ""));

        // Check for package.json
        const pkgJsonPath = path.join(localPath, "package.json");
        try {
            const pkgJsonContent = await fs.readFile(pkgJsonPath, "utf-8");
            const pkgJson = JSON.parse(pkgJsonContent);
            result.hasPackageJson = true;
            result.language = "Node.js";
            result.startScript = pkgJson.scripts?.start || null;
            result.entryPoint = pkgJson.main || "index.js"; // Default to index.js
            result.dependencies = Object.keys(pkgJson.dependencies || {});

            if (!result.startScript) {
                result.suggestions.push('Consider adding a "start" script to package.json.');
            }
        } catch {
            // No package.json or invalid
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

    return result;
}

module.exports = { analyzeRepo };

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

// utils/analyzeRepo.js
// const fs = require("fs").promises;
// const path = require("path");

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
        security: [], // Add security array
    };

    try {
        // Collect all files
        result.files = await walkDir(localPath, "", /^(package\.json|.*\.md)$/);

        // --- Security Analysis ---
        // Scan for API keys/secrets in code (not in .env files)
        const sensitivePatterns = [
            /API[_-]?KEY\s*[=:]\s*['\"][A-Za-z0-9\-_]{16,}/i,
            /SECRET\s*[=:]\s*['\"][A-Za-z0-9\-_]{8,}/i,
            /TOKEN\s*[=:]\s*['\"][A-Za-z0-9\-_]{16,}/i,
            /ACCESS[_-]?KEY\s*[=:]\s*['\"][A-Za-z0-9\-_]{8,}/i,
            /PRIVATE[_-]?KEY\s*[=:]\s*['\"][A-Za-z0-9\-_]{16,}/i,
        ];
        const ignoreFiles = [".env", ".env.example", "README.md", "LICENSE"];
        let secretsExposed = false;
        const allFiles = await fs.readdir(localPath, { recursive: true });
        for (const file of allFiles) {
            if (typeof file !== 'string') continue;
            const ext = file.split('.').pop()?.toLowerCase();
            if (ignoreFiles.some(f => file.endsWith(f))) continue;
            // Only scan code/config files
            if (["js","ts","py","json","yaml","yml","env","config","ini","php","rb","go","java","cs","cpp","c","swift","kt"].includes(ext)) {
                try {
                    const filePath = require('path').join(localPath, file);
                    const content = await fs.readFile(filePath, "utf-8");
                    for (const pattern of sensitivePatterns) {
                        if (pattern.test(content)) {
                            secretsExposed = true;
                            result.security.push(`Potential secret/API key exposure in file: ${file}`);
                            break;
                        }
                    }
                } catch {}
            }
        }
        if (!secretsExposed) {
            result.security.push("No API keys or secrets found in code/config files. All sensitive keys should be stored securely in .env files only.");
        }
        // --- End Security Analysis ---

        // Check for package.json
        const pkgJsonPath = path.join(localPath, "package.json");
        let foundDependencies = false;
        try {
            const pkgJsonContent = await fs.readFile(pkgJsonPath, "utf-8");
            const pkgJson = JSON.parse(pkgJsonContent);
            result.hasPackageJson = true;
            result.language = "Node.js";
            result.startScript = pkgJson.scripts?.start || null;
            result.entryPoint = pkgJson.main || "index.js"; // Default to index.js
            result.dependencies = Object.keys(pkgJson.dependencies || {});
            foundDependencies = result.dependencies.length > 0;

            if (!result.startScript) {
                result.suggestions.push('Consider adding a "start" script to package.json.');
            }
        } catch {
            // No package.json or invalid
        }

        // requirements.txt (Python)
        const reqsPath = path.join(localPath, "requirements.txt");
        try {
            const reqsContent = await fs.readFile(reqsPath, "utf-8");
            result.hasRequirementsTxt = true;
            if (!result.language) result.language = "Python";
            // Parse requirements.txt (ignore comments and blank lines)
            const reqs = reqsContent.split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));
            if (reqs.length > 0) {
                result.dependencies = reqs;
                foundDependencies = true;
            }
        } catch { }

        // If no dependencies found, add a default message
        if (!foundDependencies) {
            result.dependencies = ["No dependencies detected or language not supported for dependency analysis."];
        }

        // Check for other language indicators
        if (!result.language) {
            // Check for Java
            try {
                const pomPath = path.join(localPath, "pom.xml");
                await fs.access(pomPath);
                result.language = "Java";
            } catch {
                try {
                    const gradlePath = path.join(localPath, "build.gradle");
                    await fs.access(gradlePath);
                    result.language = "Java";
                } catch { }
            }
        }

        if (!result.language) {
            // Check for C#
            try {
                const csprojPath = path.join(localPath, "*.csproj");
                const csprojFiles = await fs.readdir(localPath);
                if (csprojFiles.some(file => file.endsWith('.csproj'))) {
                    result.language = "C#";
                }
            } catch { }
        }

        if (!result.language) {
            // Check for Go
            try {
                const goModPath = path.join(localPath, "go.mod");
                await fs.access(goModPath);
                result.language = "Go";
            } catch { }
        }

        if (!result.language) {
            // Check for Rust
            try {
                const cargoPath = path.join(localPath, "Cargo.toml");
                await fs.access(cargoPath);
                result.language = "Rust";
            } catch { }
        }

        if (!result.language) {
            // Check for PHP
            try {
                const composerPath = path.join(localPath, "composer.json");
                await fs.access(composerPath);
                result.language = "PHP";
            } catch { }
        }

        if (!result.language) {
            // Check for Ruby
            try {
                const gemfilePath = path.join(localPath, "Gemfile");
                await fs.access(gemfilePath);
                result.language = "Ruby";
            } catch { }
        }

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
            // Fallback: Check for common file extensions
            try {
                const allFiles = await fs.readdir(localPath, { recursive: true });
                const fileExtensions = new Set();
                
                console.log("Files found in repository:", allFiles);
                
                for (const file of allFiles) {
                    if (typeof file === 'string' && file.includes('.')) {
                        const ext = file.split('.').pop()?.toLowerCase();
                        if (ext) fileExtensions.add(ext);
                    }
                }

                console.log("File extensions detected:", Array.from(fileExtensions));

                // Language detection based on file extensions
                if (fileExtensions.has('js') || fileExtensions.has('ts') || fileExtensions.has('jsx') || fileExtensions.has('tsx')) {
                    result.language = "JavaScript/TypeScript";
                } else if (fileExtensions.has('py')) {
                    result.language = "Python";
                } else if (fileExtensions.has('java')) {
                    result.language = "Java";
                } else if (fileExtensions.has('cs')) {
                    result.language = "C#";
                } else if (fileExtensions.has('go')) {
                    result.language = "Go";
                } else if (fileExtensions.has('rs')) {
                    result.language = "Rust";
                } else if (fileExtensions.has('php')) {
                    result.language = "PHP";
                } else if (fileExtensions.has('rb')) {
                    result.language = "Ruby";
                } else if (fileExtensions.has('html') || fileExtensions.has('css')) {
                    result.language = "Web (HTML/CSS)";
                } else if (fileExtensions.has('cpp') || fileExtensions.has('c')) {
                    result.language = "C/C++";
                } else if (fileExtensions.has('swift')) {
                    result.language = "Swift";
                } else if (fileExtensions.has('kt')) {
                    result.language = "Kotlin";
                } else {
                    result.language = "Unknown";
                }
            } catch {
                result.language = "Unknown";
            }
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

import fs from 'fs/promises';
import path from 'path';

async function walkDir(dir, baseDir = "", pattern = null) {
    const results = [];
    const ignoredDirs = new Set([".git", "node_modules", ".next", ".cache", "venv", "__pycache__", "dist", "build", "ignore.js"]);
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (ignoredDirs.has(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(baseDir, entry.name);

        if (entry.isDirectory()) {
            const subResults = await walkDir(fullPath, relPath, pattern);
            results.push(...subResults);
        } else {
            if (!pattern || pattern.test(entry.name)) {
                results.push({ path: relPath });
            }
        }
    }
    return results;
}

const outputFile = path.join(process.cwd(), 'output.gtxt');

const contentArr = await walkDir(process.cwd());
const content = contentArr.map(obj => obj.path).join('\n');

await fs.writeFile(outputFile, content, 'utf-8');
console.log(`File written successfully to: ${outputFile}`);

const fs = require("fs");
const path = require("path");

/**
 * Recursively builds a directory tree string.
 * @param {string} dir - Base directory.
 * @param {string} prefix - Used internally for indentation.
 * @returns {string} - Directory tree.
 */
function getRepoTree(dir, prefix = "") {
    let output = "";

    const ignored = new Set([
        "node_modules",
        ".git",
        ".next",
        ".cache",
        "dist",
        "build",
        "venv",
        "__pycache__"
    ]);

    const entries = fs.readdirSync(dir, { withFileTypes: true })
        .filter(entry => !ignored.has(entry.name))
        .sort((a, b) => a.name.localeCompare(b.name));

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const isLast = i === entries.length - 1;
        const pointer = isLast ? "└── " : "├── ";

        output += `${prefix}${pointer}${entry.name}\n`;

        if (entry.isDirectory()) {
            const extension = isLast ? "    " : "│   ";
            output += getRepoTree(path.join(dir, entry.name), prefix + extension);
        }
    }

    return output;
}

module.exports = { getRepoTree };

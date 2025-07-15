const express = require("express");
const { cloneRepo } = require("../utils/clonerepo");
const { analyzeRepo } = require("../utils/analyserepo");
const { prepareLLMPayload } = require("../utils/prepareLLMPayload");
const { callGemini } = require("../utils/geminiClient");

const router = express.Router();

// POST /api/repos/clone
router.post("/clone", async (req, res) => {
    const { repoUrl } = req.body;

    if (!repoUrl) {
        return res.status(400).json({ error: "Repository URL is required." });
    }

    try {
        // 1) Clone the repo
        const localPath = await cloneRepo(repoUrl);

        // 2) Analyze repo
        const analysis = await analyzeRepo(localPath);

        // 3) Prepare Gemini prompt
        const { prompt, files } = prepareLLMPayload(localPath, analysis.files);

        // 4) Call Gemini
        const geminiResponse = await callGemini(prompt);

        // 5) Return everything
        console.log(geminiResponse)
        res.json({
            message: "Repository cloned and analyzed successfully.",
            localPath,
            analysis,
            files,
            geminiResponse
        });
    } catch (err) {
        console.error("Error during cloning and analysis:", err);
        res.status(500).json({ error: "Failed to process repository." });
    }
});

module.exports = router;

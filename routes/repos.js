const express = require('express');
// const fs = require('fs');
// const path = require('path');
const { cloneRepo } = require("../utils/clonerepo");
const { analyzeRepo } = require("../utils/analyserepo");

const router = express.Router()

router.post("/clone", async (req, res) => {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: "Repository URL is required." });

    try {
        const localPath = await cloneRepo(repoUrl);
        const analysis = await analyzeRepo(localPath);
        console.log(analysis);
        res.json({
            message: "Repository cloned and analyzed successfully.",
            analysis,
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to clone and analyze repository." });
    }
});

module.exports = router;
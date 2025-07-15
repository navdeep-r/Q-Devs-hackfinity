const express = require('express');
// const fs = require('fs');
// const path = require('path');
const { cloneRepo } = require('../utils/clonerepo');

const router = express.Router();

// POST /api/repos/clone
router.post('/clone', async (req, res) => {
    const { repoUrl } = req.body;

    if (!repoUrl) {
        return res.status(400).json({ error: 'Repository URL is required.' });
    }

    try {
        const localPath = await cloneRepo(repoUrl);
        res.json({
            message: 'Repository cloned successfully.',
            localPath,
        });
    } catch (err) {
        console.error('Clone failed:', err);
        res.status(500).json({ error: 'Failed to clone repository.' });
    }
});

module.exports = router;

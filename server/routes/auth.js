// routes/auth.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

// Home route (commented out - handled by frontend)
// router.get('/', (req, res) => {
//     res.send(`
//     <h2>DockZen - GitHub OAuth Example</h2>
//     <a href="${req.baseUrl}/github">Login with GitHub</a>
//   `);
// });

// Login Route
router.get('/github', passport.authenticate('github', { scope: ['repo'] }));

// Callback Route
router.get(
    '/github/callback',
    passport.authenticate('github', {
        failureRedirect: process.env.FRONTEND_URL || '/',
    }),
    (req, res) => {
        // On success, redirect to frontend profile page
        res.redirect(`${process.env.FRONTEND_URL}`);
    }
);

// Status Route - Check if user is authenticated
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: {
                username: req.user.username,
                displayName: req.user.displayName,
                avatar: req.user.photos?.[0]?.value,
                accessToken: req.user.accessToken,
            }
        });
    } else {
        res.json({
            isAuthenticated: false,
            user: null
        });
    }
});

// Profile Route (API only: returns JSON status)
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        // Redirect unauthenticated users to frontend login
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    // Optionally return profile data as JSON
    res.json({
        username: req.user.username,
        avatar: req.user.photos[0].value,
        accessToken: req.user.accessToken,
    });
});

// Logout Route - Support both GET and POST
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).send('Error logging out.');
        }
        res.redirect(`${process.env.FRONTEND_URL}/login`);
    });
});

// POST logout for API calls
router.post('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out.' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Failure handler (optional)
router.get('/failure', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
});

module.exports = router;

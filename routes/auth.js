// routes/auth.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

// Home route (optional)
router.get('/', (req, res) => {
    res.send(`
    <h2>DockZen - GitHub OAuth Example</h2>
    <a href="${req.baseUrl}/github">Login with GitHub</a>
  `);
});

// Login Route
router.get('/github', passport.authenticate('github', { scope: ['repo'] }));

// Callback Route
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/api/auth/failure' }),
    (req, res) => {
        res.redirect(`${req.baseUrl}/profile`);
    }
);

// Profile Route
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect(`${req.baseUrl}`);
    }

    res.send(`
    <h2>Welcome, ${req.user.username}</h2>
    <img src="${req.user.photos[0].value}" alt="Avatar" />
    <p><a href="${req.baseUrl}/logout">Logout</a></p>
  `);
});

// Logout Route
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).send('Error logging out.');
        }
        res.redirect(`${req.baseUrl}`);
    });
});

// Optional failure handler
router.get('/failure', (req, res) => {
    res.send(`
    <h2>GitHub Authentication Failed</h2>
    <p><a href="${req.baseUrl}/github">Try Again</a></p>
  `);
});

module.exports = router;

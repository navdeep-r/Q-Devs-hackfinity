const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

const app = express();

// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            // You might store tokens or profile here
            return done(null, profile);
        }
    )
);

// Home Route
app.get('/', (req, res) => {
    res.send('<h2>DockZen - GitHub OAuth Example</h2><a href="/auth/github">Login with GitHub</a>');
});

// Login Route
app.get('/auth/github', passport.authenticate('github', { scope: ['repo'] }));

// Callback Route
app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

// Profile Route
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        // Early exit for unauthenticated users
        return res.redirect('/');
    }

    // This block only runs if authenticated
    res.send(`
    <h2>Welcome, ${req.user.username}</h2>
    <img src="${req.user.photos[0].value}" alt="Avatar" />
    <p><a href="/logout">Logout</a></p>
  `);
});

// Logout Route
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            // Handle error (optional)
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/');
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { analyzeRepo } = require('./utils/analyserepo');
require('dotenv').config();

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
    })
);


// Session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            // Attach the token to the profile object
            profile.accessToken = accessToken;
            return done(null, profile);
        }
    )
);

// Mount authentication router on /api/auth
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Mount cloning router on /api/repos
const reposRouter = require('./routes/repos');
app.use('/api/repos', reposRouter);

// Health check route
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';



app.listen(PORT, HOST, () => {
    console.log(`Server running at ${`http://${HOST}:${PORT}`}`);

    //Playground
    // (async () => {
    //     const localRepoPath = './cloned_repos/repo_1752582222156'
    //     const analysis = await analyzeRepo(localRepoPath);

    //     console.log('--- Repo Analysis Result ---');
    //     console.log(JSON.stringify(analysis, null, 2));
    // })()
    //Playground

});

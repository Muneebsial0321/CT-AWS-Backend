const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const app = express.Router();

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// Redirect to Google OAuth 2.0
app.get("/auth/google", (req, res) => {
    const redirectUri = "https://api.teqtak.com/auth/google/callback"; // Your redirect URI
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;
    res.redirect(url);
});

// Handle Google OAuth 2.0 callback
app.get("/auth/google/callback", async (req, res) => {
    const { code } = req.query;


    try {
        // Exchange authorization code for access token
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: "https://api.teqtak.com   ",
            grant_type: "authorization_code"
        });

        console.log({tokenResponse})
        const { id_token } = tokenResponse.data;

        // Verify ID token
        const payload = jwt.verify(id_token, GOOGLE_CLIENT_SECRET);

        // Create your JWT token
        const userJwt = jwt.sign({ id: payload.sub, email: payload.email }, JWT_SECRET, { expiresIn: '1h' });

        // Store JWT in a cookie or local storage
        res.cookie('jwt', userJwt, { httpOnly: true, secure: true, sameSite: 'None' });

        // Redirect to your frontend
        res.redirect("http://localhost:5173/videos");
    } catch (error) {
        console.error("Error exchanging token", error);
        res.status(500).json({ error: "Authentication failed" });
    }
});

// Logout route
app.get("/logout", (req, res) => {
    res.clearCookie('jwt');
    res.redirect("http://localhost:5173");
});


module.exports = app
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();

const payload = { id: 123, name: 'Muneeb' };

app.get('/', (req, res) => {
    try {
        
    
  const authtoken = jwt.sign(payload, 'your-secret-key');
  res.cookie('user', 'Muneeb', { httpOnly: false });
  res.cookie('jwt', authtoken, { httpOnly: true, secure: true, sameSite: 'None' });
    const cookies = req.cookies
  res.json({cookies});
} catch (error) {
        console.log({error})
}
});
app.get("/s", (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated, you can access user info from req.user
    res.json({
      loggedIn: true,
      user: req.user, // This will contain user information from the session
      message: "User is logged in."
    });
  } else {
    // User is not authenticated
    res.json({
      loggedIn: false,
      message: "User is not logged in."
    });
  }
});


module.exports = app



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

module.exports = app



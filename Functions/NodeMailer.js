var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass:  process.env.PASS
    }
});
module.exports = transporter

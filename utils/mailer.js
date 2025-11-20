// mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // your Gmail address
    pass: process.env.EMAIL_PASS       // your App Password
  },

});

async function sendMail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });

    console.log("Mail sent:", info.messageId);
  } catch (error) {
    console.log("Error sending mail:", error);
  }
}


module.exports = sendMail;


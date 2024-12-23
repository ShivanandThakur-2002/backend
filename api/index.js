const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();


const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }
  

const app = express();
const port = 3000;
app.use(cors({
    origin: "*"
}));


const genAi = new GoogleGenerativeAI(process.env.API_KEY);

// app.use(express.static('public'));

app.get("/", (req, res) => {
    return res.status(200).send("The server started");
})

app.get("/health", (req, res) => {
    return res.status(200).send("OK");
})

app.get('/favicon.ico', (req, res) => {
    res.status(204);
})

app.post('/fetch-news', async (req, res) => {
    const { companyName, startDate, endDate } = req.body;
    if (!companyName || !startDate || !endDate) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
        const model = genAi.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `Provide controversy news about ${companyName} from ${startDate} to ${endDate}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const news = response.text();
        res.json({ news });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch news.' });
    }
});

// Handle sending emails
app.post('/send-email', async (req, res) => {
    const { emailAddress, newsSummary } = req.body;
    if (!emailAddress || !newsSummary) {
        return res.status(400).json({ error: 'Email address and news summary are required.' });
    }

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: "shivanandthakur2002@gmail.com",
            pass: "cwgqtefbnzqghlqy",
        },
    });
    

    // Configure the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailAddress,
        subject: 'News Summary',
        text: newsSummary,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = allowCors(app);

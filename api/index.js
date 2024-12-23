const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors'); // Add CORS middleware
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; // Use dynamic port for deployment

// Initialize Google Generative AI
const genAi = new GoogleGenerativeAI(process.env.API_KEY);

// Middleware
app.use(bodyParser.json());
app.use(cors({ // Enable CORS for frontend integration
    origin: 'https://cozy-flan-331cfb.netlify.app', // Replace with your actual Netlify URL
    methods: ['GET', 'POST'],
}));

// Health Check Endpoint
app.get("/", (req, res) => res.status(200).send("HOME"));
app.get("/health", (req, res) => res.status(200).send("OK"));

// Fetch News Endpoint
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

// Send Email Endpoint
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
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailAddress,
        subject: 'News Summary',
        text: newsSummary,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOpts = {
    origin: 'https://storied-banoffee-f0f725.netlify.app', // Replace with your frontend URL
    methods: ['GET', 'POST'],
};

app.use(cors(corsOpts));
app.use(bodyParser.json());

const genAi = new GoogleGenerativeAI(process.env.API_KEY);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Favicon handler
app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
});

// Fetch news endpoint
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

// Send email endpoint
app.post('/send-email', async (req, res) => {
    const { emailAddress, newsSummary } = req.body;
    if (!emailAddress || !newsSummary) {
        return res.status(400).json({ error: 'Email address and news summary are required.' });
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
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

// Export the app for serverless function
module.exports = app;

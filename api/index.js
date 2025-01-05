const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

// const app = express();
const port = 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize GoogleGenerativeAI
const genAi = new GoogleGenerativeAI(process.env.API_KEY);
console.log('GoogleGenerativeAI Initialized:', Boolean(process.env.API_KEY));

// Health check
app.get('/', (req, res) => res.status(200).send('The server started'));
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/favicon.ico', (req, res) => res.status(204));

// Fetch news endpoint
app.post('/fetch-news', async (req, res) => {
    const { companyName, startDate, endDate } = req.body;

    if (!companyName || !startDate || !endDate) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        console.log('Fetching news for:', { companyName, startDate, endDate });

        const model = genAi.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `
            Provide controversy news about ${companyName} from ${startDate} to ${endDate}.
            Include links to the news sources, prioritizing authentic websites. 
            Rank them by authenticity score (higher score = more authentic).
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        if (!response || !response.text) {
            throw new Error('Invalid response from the generative model');
        }

        const newsContent = response.text();

        // Parse and prioritize news items
        const newsItems = parseNewsResponse(newsContent);
        res.json({ news: newsItems });
    } catch (error) {
        console.error('Error in /fetch-news:', error.message || error);
        res.status(500).json({ error: 'Failed to fetch news.' });
    }
});

// Helper function to parse and prioritize news items
function parseNewsResponse(responseText) {
    const lines = responseText.split('\n');
    const newsItems = lines.map((line) => {
        const parts = line.split(' - ');
        if (parts.length === 3) {
            return {
                title: parts[0].trim(),
                url: parts[1].trim(),
                authenticityScore: parseFloat(parts[2].trim()),
            };
        }
        return null;
    }).filter(item => item !== null);

    newsItems.sort((a, b) => b.authenticityScore - a.authenticityScore);
    return newsItems;
}

// Send email endpoint
app.post('/send-email', async (req, res) => {
    const { emailAddress, newsSummary } = req.body;

    if (!emailAddress || !newsSummary) {
        return res.status(400).json({ error: 'Email address and news summary are required.' });
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const emailContent = `
        Here is the news summary:
        ${newsSummary.map(item => `- ${item.title} (${item.authenticityScore}): ${item.url}`).join('\n')}
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailAddress,
        subject: 'News Summary with Authentic Sources',
        text: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error in /send-email:', error.message || error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = allowCors(app);

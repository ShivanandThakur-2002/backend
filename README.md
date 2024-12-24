# News Aggregation System

The **News Aggregation System** is a server-side application designed to fetch controversy news about companies for specified date ranges using generative AI and send news summaries to users via email.

## Features

- **Fetch News**: Fetches controversy-related news for a specific company using Google's Generative AI model (`gemini-pro`).
- **Send Emails**: Sends news summaries to specified email addresses via Gmail using Nodemailer.
- **Health Check**: Provides health status for the server.

## Prerequisites

- Node.js (v12 or later)
- A Gmail account with App Password enabled
- Google Generative AI API key

## Environment Variables

Create a `.env` file in the root of your project and configure the following:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
API_KEY=your-google-generative-ai-api-key
```
## Installation
1. Clone this repository:
```
git clone https://github.com/your-username/news-aggregation-system.git
cd news-aggregation-system
```
2. Install dependencies:
```
npm install
```
3. Add your .env file as described above.

## Usage
Local Development
1. Start the server:
```
npm start
```
2. Access the server at http://localhost:3000.

## Endpoints
**GET** ```/```
  - Returns a simple message confirming the server is running.
**GET** ```/health```
  - Returns OK to verify the health of the server.
**POST** ```/fetch-news```
  - Request Body:
  json
{
  "companyName": "Company Name",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
Response:
200 OK: Returns news summary in JSON format.
400 Bad Request: If required fields are missing.
500 Internal Server Error: If an error occurs during news generation.
POST /send-email
Request Body:
json
Copy code
{
  "emailAddress": "recipient@example.com",
  "newsSummary": "Summary of the news"
}
Response:
200 OK: Email sent successfully.
400 Bad Request: If required fields are missing.
500 Internal Server Error: If an error occurs during email sending.
Deployment
Vercel
Configure your vercel.json file:

json
Copy code
{
  "version": 2,
  "rewrites": [
    { "source": "/(.*)", "destination": "/api" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ]
}
Deploy the project on Vercel.

Technologies Used
Node.js: Backend framework
Express.js: Server framework
Nodemailer: Email handling
Google Generative AI: News generation
dotenv: Environment variable management
CORS: Cross-origin resource sharing
Troubleshooting
500 Errors

Check API key, email credentials, and environment variables.
Ensure proper configurations in vercel.json for deployed environments.
404 Errors

Verify the API route structure and ensure correct deployment on Vercel.
CORS Issues

Ensure the appropriate headers are set in both the server and vercel.json.
License
This project is licensed under the MIT License.

# Controversy News Aggregation System
A web-based system designed to aggregate and summarize controversy news about a specific company within a specified date range. The system leverages Google Generative AI for news summarization and includes an automated email feature for delivering summaries to designated recipients.

## Features
1. **Company-specific News**

2. **Retrieve controversy news about a specific company.**
     - Date Range Filtering

3. **Filter news based on user-specified start and end dates.**
     - Interactive User Interface

4. **Easy-to-use form for input and result display.**
     - AI-powered Summarization

5. **Utilizes Google Generative AI for concise and accurate news summaries.**
     - Automated Email Feature

6. **Automatically emails the generated news summary to the specified recipient.**

## Project Structure
```
controversy-news-aggregator/
├── public/
│   ├── index.html         
│   ├── style.css          
│   ├── bundle.js          
├── .env                   
├── server.js              
├── package.json           
├── vercel.json            
└── README.md

```           
## Prerequisites
1. **Node.js**
  - Ensure Node.js is installed on your system.

2. **Google Generative AI Access**
  - API key for Google Generative AI is required.

3. **Email Service**
  - Use a mailing service like Nodemailer and configure SMTP settings in the .env file.

## Installation

1. **Clone the repository:**
```
git clone https://github.com/your-username/controversy-news-aggregator.git
cd controversy-news-aggregator
```
2. **Install dependencies:**
```
npm install
```
3. **Create a .env file in the root directory and add the following:**
```
plaintext
Copy code
API_KEY=your_google_generative_ai_api_key
EMAIL_SERVICE=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```
## Usage
1. Start the server:
```
node server.js
```
2. Open your browser and navigate to:
html
```
http://localhost:3000
```
3. **Use the form on the webpage to input:**
  - Company Name: Enter the name of the company.
  - Start Date: Select the start date for news filtering.
  - End Date: Select the end date for news filtering.
  - Email: Provide the recipient's email address.\

4. **Click Generate Summary to fetch news and send the summary via email.**

## API Workflow
1. User inputs details in the form.
2. The frontend sends a POST request to /fetch-news with the following payload:
```
json
Copy code
{
    "companyName": "Example Company",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "email": "recipient@example.com"
}
```
3. The server generates a prompt and interacts with Google Generative AI to fetch controversy news.
4. The news is sent back as a JSON response and displayed on the webpage.
5. The generated news summary is emailed to the specified recipient using the configured SMTP service.

## Technology Stack
**Frontend:**
  - HTML5, CSS3, JavaScript (Vanilla)

**Backend:**
1. Node.js
2. Express.js
3. Google Generative AI (@google/generative-ai library)
4. Nodemailer (for email functionality)

## Error Handling
- Displays user-friendly error messages for:
  - Missing input fields.
  - Invalid email addresses.
  - Server errors or failed API calls.
- Logs server-side errors for debugging.

## Future Enhancements
  - Add support for multiple AI models for comparison.
  - Implement advanced filtering options (e.g., sentiment analysis, news categories).
  - Enhance UI for better responsiveness and aesthetics.
  - Add email templates for a more professional appearance.

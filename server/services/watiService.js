const axios = require('axios');
require('dotenv').config();

const WATI_API_URL = process.env.WATI_API_URL || 'https://api.wati.io/api/v1';
const WATI_API_TOKEN = process.env.WATI_API_TOKEN;

// Handle incoming webhook events from Wati
const handleWebhook = (req, res) => {
  const { event_type, data } = req.body;

  if (event_type === 'message') {
    const { text, from } = data;
    console.log(`Received message from ${from}: ${text}`);

    // Add your chatbot logic here (e.g., respond based on message content)
    // Example: If user sends "hi", respond with a greeting
    if (text.toLowerCase() === 'hi') {
      sendMessage(from, 'Hello! Welcome to our WhatsApp chatbot.');
    }
  }

  res.status(200).send('Webhook received');
};

// Send a message via Wati API
const sendMessage = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      `${WATI_API_URL}/sendMessage`,
      {
        phone: phoneNumber,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${WATI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to send message: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

function checkUser(phone) {
  
}

function getReccommendations(keyword) {
  // Placeholder for recommendation logic
  return [];
}

function onBoardUser(userData) {
  // Placeholder for user onboarding logic
  return { success: true, message: 'User onboarded successfully' };
}

function fetchUserCourses(userId) {
  // Placeholder for fetching user courses
  return [];
}

module.exports = { handleWebhook, sendMessage };
// if (text.toLowerCase() === 'help') {
//   sendMessage(from, 'How can I assist you? Type "menu" for options.');
// } else if (text.toLowerCase() === 'menu') {
//   sendMessage(from, 'Options: 1. Info 2. Support 3. Contact');
// }

const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../services/watiService');

// Webhook endpoint to receive messages from Wati
router.post('/', async (req, res) => {
  const { event_type, data } = req.body;

  console.log('Webhook event received:', req.body);

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
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { sendMessage } = require('../services/watiService');

// Endpoint to send a WhatsApp message
router.post('/send', async (req, res) => {
  const { phoneNumber, message } = req.body;
  if (!phoneNumber || !message) {
    return res
      .status(400)
      .json({ error: 'phoneNumber and message are required' });
  }

  try {
    const response = await sendMessage(phoneNumber, message);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.post('/webhook', (req, res) => {
  console.log('WhatsApp webhook received:', req.body);
  const text = req.body?.text?.toLowerCase?.() || '';
  let reply = 'OK';

  if (text === 'menu') {
    reply = `Available commands:\n- Check result [ID]\n- Sign up [Name] [Email]\n- Login [ID] [PIN]\n- Get video [Name]\n- Menu`;
  } else if (text.startsWith('check result')) {
    reply = 'Please provide your ID after "Check result".';
  } else if (text.startsWith('sign up')) {
    reply = 'Please provide your Name and Email after "Sign up".';
  } else if (text.startsWith('login')) {
    reply = 'Please provide your ID and PIN after "Login".';
  } else if (text.startsWith('get video')) {
    reply = 'Please provide the video name after "Get video".';
  }

  res.status(200).json({ reply });
});

async function sendLoad(load) {
  const resp = await fetch(
    'https://q27ms9pp-6000.uks1.devtunnels.ms/api/whatsapp/load',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ load }),
    }
  );
  if (!resp.ok) {
    console.error('Failed to send load:', resp.statusText);
  } else {
    const data = await resp.json();
    console.log('Load response:', data);
    console.log('Load sent successfully');
  }
}

module.exports = router;

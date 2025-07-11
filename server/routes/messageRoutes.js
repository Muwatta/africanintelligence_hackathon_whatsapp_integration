const express = require('express');
const router = express.Router();

router.post('/send-template', async (req, res) => {
  const { phoneNumber, templateName, parameters } = req.body;
  try {
    const response = await axios.post(
      `${WATI_API_URL}/sendTemplateMessage`,
      { phone: phoneNumber, template_name: templateName, parameters },
      {
        headers: {
          Authorization: `Bearer ${WATI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

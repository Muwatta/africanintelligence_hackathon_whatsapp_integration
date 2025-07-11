const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const webhookRoutes = require('./routes/webhookRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use('/api/', limiter);

// Routes
app.use('/api/whatsapp/webhook', webhookRoutes);
app.use('/api/message', messageRoutes);

// Webhook verification endpoint for Wati
app.get('/api/webhook', (req, res) => {
  const { token } = req.query;
  if (token === process.env.WATI_WEBHOOK_TOKEN) {
    res.status(200).send('Webhook verified');
  } else {
    res.status(403).send('Invalid token');
  }
});

// Basic route for health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Wati WhatsApp Chatbot API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

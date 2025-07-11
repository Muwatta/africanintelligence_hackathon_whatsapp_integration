const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const facilitatorRoutes = require('./routes/facilitatorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/course');
const forumRoutes = require('./routes/forum');
const notificationRoutes = require('./routes/notification');
const uploadRoutes = require('./routes/upload');
const adminServices = require('./services/adminServices');
const webpush = require('web-push');
const { clg } = require('./routes/basics');
const axios = require('axios');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

if (process.env.PUBLIC_VAPID_KEY && process.env.PRIVATE_VAPID_KEY) {
  webpush.setVapidDetails(
    'mailto:test@example.com',
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
  );
  app.set('webpush', webpush);
  console.log('Web Push configured successfully');
} else {
  console.warn('Web Push not configured. Missing VAPID keys.');
}

app.post('/whatsapp/webhook', async (req, res) => {
  console.log('WATI_API_TOKEN:', process.env.WATI_API_TOKEN);
  console.log('Webhook payload:', JSON.stringify(req.body, null, 2));
  try {
    const { text, waId } = req.body;
    if (text && text.toLowerCase() === 'menu') {
      const response = `Available commands:
- Check result [ID]
- Sign up [Name] [Email]
- Login [ID] [PIN]
- Get video [Name]
- Menu`;
      await axios.post(
        'https://api.wati.io/api/v1/sendSessionMessage',
        {
          phone: waId,
          message: response,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WATI_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response sent to:', waId);
    }
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).send('Error processing webhook');
  }
});

app.get('/test', (req, res) => {
  res.send('Server is running!');
});

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';
const client = new MongoClient(mongoURI);

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    app.locals.db = client.db();
    await adminServices.initializeDefaultDocumentation(app.locals.db);
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/facilitator', facilitatorRoutes);
    app.use('/api/learner', studentRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/forum', forumRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/upload', uploadRoutes);
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../build')));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
      });
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

startServer().catch(console.error);

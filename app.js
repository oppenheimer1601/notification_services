const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const dotenv = require('dotenv');
dotenv.config();

const Notification = require('./models/notification');
const User = require('./models/user');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/notification_service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function publishToQueue(data) {
  try {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    await channel.assertQueue('notifications');
    channel.sendToQueue('notifications', Buffer.from(JSON.stringify(data)));
    setTimeout(() => conn.close(), 500);
  } catch (error) {
    console.error('Queue publish error:', error);
  }
}

app.post('/api/notifications', async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    const notification = new Notification({ user: userId, type, message });
    await notification.save();
    await publishToQueue(notification);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:userId/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

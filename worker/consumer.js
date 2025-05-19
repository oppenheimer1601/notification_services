const mongoose = require('mongoose');
const amqp = require('amqplib');
const dotenv = require('dotenv');
const Notification = require('../models/notification');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendNotification(notification) {
  const user = await User.findById(notification.user);

  if (!user) throw new Error('User not found');

  if (Math.random() > 0.7) throw new Error('Simulated failure');

  switch (notification.type) {
    case 'email':
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Notification',
        text: notification.message
      });
      console.log(`📧 Email sent to ${user.email}`);
      break;
    case 'sms':
      await twilioClient.messages.create({
        body: notification.message,
        from: process.env.TWILIO_PHONE,
        to: user.phone
      });
      console.log(`📱 SMS sent to ${user.phone}`);
      break;
    case 'in-app':
      console.log(`🖥️ In-app notification: ${notification.message}`);
      break;
    default:
      throw new Error('Unsupported notification type');
  }
  return true;
}

async function consume() {
  await mongoose.connect('mongodb://localhost:27017/notification_service');

  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue('notifications');

  console.log('📥 Waiting for messages...');

  channel.consume('notifications', async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      const doc = await Notification.findById(data._id);

      try {
        await sendNotification(doc);
        doc.status = 'sent';
        await doc.save();
        channel.ack(msg);
      } catch (err) {
        console.log(`❌ Error: ${err.message}`);
        console.log(`Retry #${doc.retries + 1} for notification ${doc._id}`);

        if (doc.retries < 2) {
          doc.retries += 1;
          await doc.save();
          channel.nack(msg, false, true); // requeue
        } else {
          doc.status = 'failed';
          await doc.save();
          channel.ack(msg); // discard
        }
      }
    }
  });
}

consume().catch(console.error);

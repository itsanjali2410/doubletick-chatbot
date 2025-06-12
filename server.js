const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); // ✅ import uuidv4
require('dotenv').config();
console.log("API KEY Loaded:", process.env.DOUBLETICK_API_KEY);
console.log("FROM Number Loaded:", process.env.DOUBLETICK_FROM_NUMBER);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DOUBLE_TICK_API_KEY = process.env.DOUBLETICK_API_KEY;
const FROM_NUMBER = process.env.DOUBLETICK_FROM_NUMBER; // ✅ Add this in .env

// Webhook to handle incoming messages
app.post('/webhook', async (req, res) => {
  console.log("📩 Webhook triggered!");
  console.log(JSON.stringify(req.body, null, 2));

  const { phone, message } = req.body;

  if (!phone || !message) {
    console.error("❌ Missing 'phone' or 'message' in webhook payload");
    return res.sendStatus(400);
  }

  const reply = getCustomReply(message);

  if (reply) {
    try {
      await sendWhatsAppMessage(phone, reply);
      console.log(`✅ Replied to ${phone} with: ${reply}`);
    } catch (error) {
      console.error('❌ Failed to send message:', error.response?.data || error.message);
    }
  }

  res.sendStatus(200);
});

// Custom rule-based replies
function getCustomReply(message) {
  const text = message.trim().toLowerCase();

  if (text.includes('hi') || text.includes('hello')) {
    return 'Hi there! 👋 How can I assist you today?';
  }
  if (text.includes('bali')) {
    return '🌴 Bali packages start from ₹49,999. Would you like an itinerary?';
  }
  if (text.includes('vietnam')) {
    return '🇻🇳 Vietnam is a beautiful destination! Tell us your travel dates.';
  }
  if (text.includes('price')) {
    return 'Prices vary by date and location. Where would you like to go?';
  }
  if (text.includes('help')) {
    return 'You can ask me about Bali, Vietnam, prices, or say hello!';
  }

  return "Sorry, I didn't understand. Please type a destination or say 'help'.";
}

// ✅ Function to send message using DoubleTick API
async function sendWhatsAppMessage(to, message) {
  const response = await axios.post('https://public.doubletick.io/whatsapp/message/template', {
    from: FROM_NUMBER,
    to: to,
    messageId: uuidv4(),
    content: {
      type: "text",
      text: message
    }
  }, {
    headers: {
      'Authorization': `Bearer ${DOUBLETICK_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

app.get('/', (req, res) => {
  res.send('✅ Bot is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});

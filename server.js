const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Replace with your DoubleTick API Key
const DOUBLE_TICK_API_KEY = process.env.DOUBLETICK_API_KEY;

app.post('/webhook', async (req, res) => {
  const { phone, message } = req.body;
  console.log(`Received: ${message} from ${phone}`);

  const reply = getCustomReply(message);

  if (reply) {
    await sendWhatsAppMessage(phone, reply);
  }

  res.sendStatus(200);
});

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

async function sendWhatsAppMessage(phone, message) {
  try {
    await axios.post('https://app.doubletick.io/api/send', {
      phone,
      message
    }, {
      headers: {
        Authorization: `Bearer ${DOUBLETICK_API_KEY}`
      }
    });
    console.log(`Replied to ${phone}: ${message}`);
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
}
app.get('/', (req, res) => {
  res.send('✅ Bot is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const userStates = {}; // Replace with Redis or DB in production

// Function to send a WhatsApp message
async function sendMessage(phone, message) {
  try {
    await axios.post("https://public.doubletick.io/whatsapp/message/text", {
      phone,
      message,
    }, {
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "x-api-key": process.env.DOUBLETICK_API_KEY
      }
    });
  } catch (error) {
    console.error("Message send failed:", error.message);
  }
}

// Webhook endpoint
app.post("/webhook", async (req, res) => {
  const { phone, message } = req.body;

  const user = userStates[phone] || {};

  if (!user.step) {
    await sendMessage(phone, "Hi! What is your travel destination?");
    userStates[phone] = { step: "location" };
  } else if (user.step === "location") {
    userStates[phone] = { ...user, location: message, step: "date" };
    await sendMessage(phone, "Great! What’s your travel date?");
  } else if (user.step === "date") {
    userStates[phone] = { ...user, date: message, step: "passengers" };
    await sendMessage(phone, "How many passengers?");
  } else if (user.step === "passengers") {
    userStates[phone] = { ...user, passengers: message, step: "done" };

    const { location } = userStates[phone];
    if (location.toLowerCase() === "bali") {
      await sendMessage(phone, "🌴 Here’s your Bali itinerary: https://yourdomain.com/bali-itinerary.pdf\n💰 Budget: ₹50,000 per person.");
    } else {
      await sendMessage(phone, `Thanks! We'll prepare your itinerary for ${location} and share it soon.`);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handleIncomingMessage } = require('./bot/logic');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    console.log("Incoming webhook data:", req.body); // ← debug line

    await handleIncomingMessage(req.body); // pass to logic
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});


app.listen(PORT, () => {
  console.log(`Webhook server running at http://localhost:${PORT}`);
});

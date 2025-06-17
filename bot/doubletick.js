const axios = require('axios');
require('dotenv').config(); // Load token from .env

const sendTemplateMessage = async (number, templateName) => {
  try {
    await axios.post("https://public.doubletick.io/whatsapp/message/template", {
      to: number,
      templateName: templateName,
      params: [] // Add parameters if needed
    }, {
      headers: {
        Authorization: `Bearer ${process.env.DOUBLETICK_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Send template error:", error.response?.data || error.message);
  }
};

module.exports = { sendTemplateMessage };

const { getUserState, setUserState } = require('./userState');
const { sendTemplateMessage } = require('./doubletick');

const extractUserDetails = (text) => {
  const travelMonth = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b/i)?.[0];
  const pax = text.match(/\d+/)?.[0];
  const departure = text.match(/\b(Mumbai|Delhi|Pune|Hyderabad|Bangalore)\b/i)?.[0];
  const destination = text.match(/\b(Bali|Vietnam|Thailand|Singapore|Baku)\b/i)?.[0];

  return { travelMonth, pax, departure, destination };
};

const handleIncomingMessage = async ({ whatsappNumber, messageBody }) => {
  const userState = getUserState(whatsappNumber);

  if (!userState) {
    setUserState(whatsappNumber, { stage: 'asked' });
    return sendTemplateMessage(whatsappNumber, "tripstars_welcome_template");
  }

  if (userState.stage === 'asked') {
    const info = extractUserDetails(messageBody);
    setUserState(whatsappNumber, { ...userState, ...info, stage: 'complete' });

    console.log("✅ Qualified lead:", {
      number: whatsappNumber,
      ...info
    });

    return sendTemplateMessage(whatsappNumber, "thank_you_template");
  }
};

module.exports = { handleIncomingMessage };

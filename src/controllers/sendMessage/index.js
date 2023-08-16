const TelegramBot = require("node-telegram-bot-api");
const chatIds = [
  1551855614 /* @Real_Coder */, 6066715653 /* @kalde_03 */,
  6480245379 /* @kalde_01*/, 5033207519 /* @MegaCoder_uz */,
];

const bot = new TelegramBot(
  process.env.BOT_TOKEN ?? "6425687419:AAEjztpOA8ZCUGMlPNYLV68L25RQCLZNdXM",
  {
    polling: false,
  }
);

const FormSendMessage = async (req, res) => {
  let { name, phone, message } = req.body;
  //   phone = phone.replaceAll(" ", "");

  if (
    !name ||
    name.length === 0 ||
    !phone ||
    phone.length === 0 ||
    !message ||
    message.length === 0
  )
    return res.send("Fill all the inputs!");
  if (isNaN(phone)) {
    return res.send("Provide valid phone number");
  }
  try {
    for (const chatId of chatIds) {
      await bot.sendMessage(
        chatId,
        `
        Kalde.uz dan yangi xabar keldi: \n 
        <b>● Ismi: </b>${name} 
        <b>● Telefon Raqami: </b>${phone} 
        <b>● Xabar: </b>${message}
        <b>● Yuborilgan Sana : </b>${new Date().toLocaleDateString()}
        <b>● Yuborilgan Soati : </b>${new Date().toLocaleTimeString()}`,
        { parse_mode: "HTML" }
      );
    }
    return res
      .status(200)
      .json({ message: "Message sent successfully to all recipients." });
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while sending the message." });
  }
};

module.exports = {
  FormSendMessage,
};

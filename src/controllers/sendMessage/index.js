const TelegramBot = require("node-telegram-bot-api");
const chatIds = [
  1551855614 /* @Real_Coder */, 6066715653 /* @kalde_03 */,
  6480245379 /* @kalde_01*/, 5033207519 /* @MegaCoder_uz */,
  2127610874 /* @Rajapov_Supersite */, 3520694 /* @YorqinAgzamOvich */,
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
    return res
      .status(400)
      .json(
        { error_uz: "Barcha maydonlarni to'ldiring" },
        { error_ru: "Заполните все поля" },
        { error_en: "Please fill all the fields." }
      );

  if (isNaN(phone)) {
    return res
      .status(403)
      .json(
        { error_uz: "Telefon raqamini to'gri kiriting" },
        { error_ru: "Введите правильный номер телефона" },
        { error_en: "Enter the correct phone number" }
      );
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

const TeleBot = require("telebot");

//instantiate Telebot with our token got in the BtFather
const bot = new TeleBot({
  token: "AAGYz1-hDo2eTyOnEEBQr-3PfZAIdBJVmQU",
});

//our command
bot.on(["/start", "/hello"], (msg) => {
  //all the information about user will come with the msg
  console.log(msg);
  bot.sendMessage(msg.from.id, `Hello ${msg.chat.username}`);
});

//start polling
bot.start();
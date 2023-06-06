const TeleBot = require("telebot");
const config = require("../config/keys");
//instantiate Telebot with our token got in the BtFather
const bot = new TeleBot({
  token: config.telegram,
});

//our command
bot.on(["/start", "/hello"], (msg) => {
  //all the information about user will come with the msg
  console.log(msg);
  bot.sendMessage(msg.from.id, `Hello ${msg.chat.username}`);
});

//start polling
bot.start();
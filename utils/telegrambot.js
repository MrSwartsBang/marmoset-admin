const TeleBot = require("telebot");
const config = require("../config/keys");
const { Telegraf } = require('telegraf');

const bot = new Telegraf(config.telegram);

bot.launch();

bot.command('start', ctx => {
  console.log(ctx.from)
  bot.telegram.sendMessage(ctx.chat.id, 'Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it', {
  })
})

bot.command('ethereum', ctx => {
  var rate;
  console.log(ctx.from)
  const message = `Hello, today the ethereum price is USD`
  bot.telegram.sendMessage(ctx.chat.id, message, {})

})
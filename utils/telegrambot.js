const TeleBot = require("telebot");
const config = require("../config/keys");
// const { Telegraf } = require('telegraf');

// const bot = new Telegraf(config.telegram);

// bot.launch();

// bot.command('start', ctx => {
//   console.log(ctx.from)
//   bot.telegram.sendMessage(ctx.chat.id, 'Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it', {
//   })
// })
// bot.on('message', (ctx) => {
//   console.log(ctx.message.text)
// })
// bot.command('ethereum', ctx => {
//   var rate;
//   console.log(ctx.from)
//   const message = `Hello, today the ethereum price is USD`
//   bot.telegram.sendMessage(ctx.chat.id, message, {})

// })

//-----------------------------------------//
const TelegramBot = require('node-telegram-bot-api');

// Replace YOUR_TOKEN_HERE with your actual bot token obtained from BotFather
const bot = new TelegramBot(config.telegram, { polling: true });

// Replace CHANNEL_NAME_HERE with the name of your channel (including @ symbol)
const channelName = 'CHANNEL_NAME_HERE';

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg.chat);
  // Check if message was sent in the channel
  if (msg.chat.username === channelName.substr(1)) {
    bot.sendMessage(chatId, 'Hello');
  }
});
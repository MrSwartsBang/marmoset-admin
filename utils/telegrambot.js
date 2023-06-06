const TeleBot = require("telebot");
const config = require("../config/keys");
const { clientAPI, APICall } = require("./getNFT");
const Verified = require("../models/Verified");
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

bot.on('message',async (msg) => {
  const chatId = msg.chat.id;
  console.log(msg.from.username);
  const isVerifiedUser = await Verified.findOne({discord:msg.from.username});
  if(isVerifiedUser){
    const NFTcount = await checkNFTowner(isVerifiedUser.wallet);

    // Check if user has at least one NFT
    if (NFTcount > 0) {
      // Get the user ID for the current message sender
      const userId = msg.from.id;

      // Set the user as an administrator in the chat
      bot.promoteChatMember(chatId, userId, {
        can_change_info: false,
        can_post_messages: true,
        can_edit_messages: true,
        can_delete_messages: true,
        can_invite_users: false,
        can_restrict_members: false,
        can_pin_messages: true,
        can_promote_members: false
      });

      bot.sendMessage(chatId,"Congratulations! You have been promoted to an administrator because you own "+NFTcount+" NFTs.");
    } else {
      bot.sendMessage(chatId,"You own "+NFTcount+" NFTs.");
    }

  }else{
    bot.sendMessage(chatId,"You are not a member of marmoset, please verify. http://ec2-44-201-124-72.compute-1.amazonaws.com/verify")
  }
  // Check if message was sent in the channel
  // if (msg.chat.username === channelName.substr(1)) {
  //   bot.sendMessage(chatId, 'Hello');
  // }
});




async function checkNFTowner(ownerAddress) {
  console.log(clientAPI);
  const allCollectionsOwned = await clientAPI("post", "/getCollections", {
      limit: 10000,
      offset: 0,
      sort: -1,
      isActive: true
  });
  let data = await Promise.all(
      allCollectionsOwned?.map(async (collection) => {
          const options = {
              collection_address: collection.nftContractAddress,
              owner: ownerAddress,
              limit: 10000,
              offset: 0,
              sort: -1
          };

          let { ret: dataList } = await APICall.getNFTsByOwnerAndCollection(options);

          dataList = dataList.filter((item) => item.is_for_sale !== true);
          
          const data = dataList?.map((item) => {
              return { ...item, stakeStatus: 0 };
          });

          collection.listNFT = data;

          return collection;
      })
  );
  data = data.filter((item) => item.listNFT?.length > 0);
  return data[0].listNFT.length;
}

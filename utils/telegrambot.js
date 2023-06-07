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


bot.on('message',async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;



  if (msg.from.is_bot) return;

  
  if (msg.new_chat_members !== undefined) {
    // console.log(msg.new_chat_members);
    for (let i = 0; i < msg.new_chat_members.length; i++) {
      const newMember = msg.new_chat_members[i];
      const dmLink = `https://t.me/${bot.options.username}?start=dm_${newMember.id}`;
      const replyMarkup = {
        inline_keyboard: [
          [{ text: 'Start DM with me', url: dmLink }]
        ]
      };
      bot.sendMessage(chatId, `Welcome to the group! Please click this [link](${dmLink}) to start a DM with me.`, { reply_markup: replyMarkup, parse_mode: "Markdown" });
    
    }
  }
  else {

    const isVerifiedUser = await Verified.findOne({telegram:"@"+msg.from.username});
    if(isVerifiedUser){
      console.log(isVerifiedUser);
      const chatMember = await bot.getChatMember(chatId, userId);
      if(chatMember.status.includes("administrator")){
       
      }
      else
      {
        const NFTcount = await checkNFTowner(isVerifiedUser.wallet);
        if (NFTcount > 0) {
          console.log("==============True==================");
            
        } else {
          
        
          console.log(await getUserGroupId());
         
          bot.sendMessage(userId,"You own "+NFTcount+" NFTs. Please buy an NFT.");
        }
      }
    }else{
      bot.sendMessage(userId,"You are not a member of marmoset, please verify. http://ec2-44-201-124-72.compute-1.amazonaws.com/verify")
    }
  }
});
// Get the bot's username
bot.getMe().then((botInfo) => {
  bot.options.username = botInfo.username;
  console.log(`Bot started as ${botInfo.username}`);
});


// Define an async function to get the user group ID of your bot in the channel
async function getUserGroupId() {
  try {
    // Call the getUpdates method to get the chat ID of your channel
    const updates = await bot.getUpdates();
    const latestUpdate = updates[updates.length - 1];
    const channelId = latestUpdate.message.chat.id;

    // Call the getChatAdministrators method to get a list of chat administrators, including your bot
    const admins = await bot.getChatAdministrators(channelId);
    
    // Find the entry in the list that corresponds to your bot and get its chat ID
    console.log(admins);
    const botAdmin = admins.find((admin) => admin.user.username === '@marmoset_club_bot');
    const permissionGroupId = botAdmin.chat.id;

    // Print the user group ID
    console.log(`User group ID of your bot in the channel: ${permissionGroupId}`);
  } catch (error) {
    console.error(error);
  }
}




async function checkNFTowner(ownerAddress) {

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
  if(data.length)
  return data[0].listNFT.length;
  else return 0;
}

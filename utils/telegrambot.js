const { clientAPI, APICall } = require("./getNFT");
const Verified = require("../models/Verified");
const {VerifiCode} = require("./marmosetUtils");
//-----------------------------------------//
const TelegramBot = require('node-telegram-bot-api');

// Replace YOUR_TOKEN_HERE with your actual bot token obtained from BotFather
const bot = new TelegramBot(process.env.telegram, { polling: true });
const permissions = {
  can_send_messages: true,
  can_send_media_messages: false,
  can_send_polls: false,
  can_send_other_messages: false,
  can_add_web_page_previews: false,
  can_change_info: false,
  can_invite_users: false,
  can_pin_messages: false,
};

bot.on('message',async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;
  const chatMember = await bot.getChatMember(chatId, userId);
  const membershipStatus = await checkMembership(userId, chatId);
  if(chatMember.status.includes("administrator"))return;
  else if(chatMember.status.includes("creator"))return;

  if (msg.from.is_bot) return;
  if (msg.new_chat_members !== undefined) {
    // console.log(msg.new_chat_members);
    for (let i = 0; i < msg.new_chat_members.length; i++) {
      const dmLink = `https://marmosetclub.io/verify`;
      const replyMarkup = {
        inline_keyboard: [
          [{ text: 'Become a member', url: dmLink }]
        ]
      };
      bot.sendMessage(chatId, `Welcome to the group! Please click this [link](${dmLink}) to verify.`, { reply_markup: replyMarkup, parse_mode: "Markdown" });
    
    }
  }
  else {
    
    const isVerifiedUser = await Verified.findOne({telegram:msg.from.username});
    if(isVerifiedUser){      
      const NFTcount = await checkNFTowner(isVerifiedUser.wallet);
      if (NFTcount > 0) {
        console.log("==============True==================");
        // call promoteChatMember to set the specified permissions
        bot.promoteChatMember(chatId, userId, {
          chat_permissions: {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_change_info: true,
            can_invite_users: true,
            can_pin_messages: true,
          }
        });

      } else {
        if(membershipStatus){
          await bot.restrictChatMember(chatId, userId, permissions);
          bot.sendMessage(userId,"You are restricted all permissions. Because you don't have any NFT. Buy an NFT and send message 'I am a NFT owner.'");

          if (text !== 'ttt') {
              await bot.deleteMessage(chatId, msg.message_id);
          }else{
          }
        }
      }
      
    }else{
      // bot.sendMessage(userId,"You are not a member of marmoset, please verify. https://marmosetclub.io/verify");
      const dmLink = `https://marmosetclub.io/verify`;
      const replyMarkup = {
        inline_keyboard: [
          [{ text: 'Become a member', url: dmLink }]
        ]
      };
      bot.sendMessage(userId, `You are not a member of marmoset, please verify on [link](${dmLink}).`, { reply_markup: replyMarkup, parse_mode: "Markdown" });
      if(msg.chat.type.includes("private")){
        await bot.restrictChatMember(chatId, userId, permissions);
        await bot.deleteMessage(chatId, msg.message_id);
      }
    }
  }
});
// Get the bot's username
bot.getMe().then((botInfo) => {
  bot.options.username = botInfo.username;
  console.log(`Bot started as ${botInfo.username}`);
});

// Call the getUpdates method to retrieve information about recent updates
bot.getUpdates().then((updates) => {
  // Extract the chat IDs of all channels that the bot is a member of
  const channelIds = updates
    .map((update) => update.channel_post || update.message)
    .filter((msg) => msg != null && msg.chat.type === 'channel' && msg.chat.username !== undefined)
    .map((msg) => ({
      id: msg.chat.id,
      username: msg.chat.username
    }));

  console.log(channelIds);
});

// Define a function to check if the user is a member of the specified channel
async function checkMembership(userId, channelId) {
  try {
    // Call the getChatMember method to get the user object for the specified user ID in the specified channel
    const response = await bot.getChatMember(channelId, userId);
    const userObject = response.user;

    // Check if the user is a member of the channel or not
    // console.log(response.status);
    if (response.status === 'member' || response.status === 'creator' || response.status === 'administrator' || response.status === "restricted") {
      console.log(`User ${userObject.username} is a member of the channel.`);
      return true;
    } else {
      console.log(`User ${userObject.username} is NOT a member of the channel.`);
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
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

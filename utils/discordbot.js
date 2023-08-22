  // Import discord.js and create the client
  const { clientAPI, APICall } = require("./getNFT");
  const Discord = require('discord.js')
  const client = new Discord.Client();
  const Verified = require("../models/Verified");
  const {VerifiCode} = require("./marmosetUtils");
  // Register an event so that when the bot is ready, it will log a messsage to the terminal
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  })

  // Register an event to handle incoming messages
  client.on('message', async msg => {
    // This block will prevent the bot from responding to itself and other bots
    console.log(msg.author);
    if(msg.author.bot) return;
    const isVerifiedUser = await Verified.findOne({discord:msg.author.tag});
    
    //-------------------------DM verify---------------------//
    const channel = msg.channel;
    if (msg.channel.type.includes("dm")) 
    {
      // Handle DM message here
      console.log(`verify DM from ${msg.author.tag}: ${msg.content}`);
            
      if(!isVerifiedUser)
      {
        var validWallet = VerifiCode.verify(msg.content);
        var dmToClient;
        const polkadotReg = /^[a-zA-Z0-9]{48,}$/.test(validWallet);
        if (polkadotReg)
        {
          try {
            const verifiedData = await Verified.create({ wallet: validWallet, discord: msg.author.tag });
            console.log('Document created successfully');
            dmToClient = "Hey there! I received your verification code.You are verified on marmosetClub";
          } catch (error) {
            console.log('Error:', error.message);
            Verified.findOneAndUpdate({ wallet: validWallet},{discord: msg.author.tag}).then(r=>console.log).catch(e=>console.warn);
            dmToClient = "Hey there! I received your verification code. Your verification has been updated.";
          }
        }
        else{
          // 0: invalid code
          // 1: time expired
          dmToClient = validWallet? "Verification code has been expired.":"It's invalid code. Please create new one.";
          // msg.reply(messageInvalid);
        }
      }
      else {
          dmToClient = "You already have been verified.";
      }
      return msg.reply(dmToClient);
    }
    //-----------------------------------------------------//
    // Get the roles of the member who sent the message
    const roles = msg.member.roles.cache.map(role => role.name);
    // Log the roles
    console.log(`Roles of ${msg.author.tag}: ${roles.join(', ')}`);
    if(isVerifiedUser)
    {
        const NFTcount = await checkNFTowner(isVerifiedUser.wallet);
        let roleName;
        if(NFTcount===0)
        {
            roleName = "NoNFT";
            if(!roles.includes(roleName)){
		            let role = msg.guild.roles.cache.find(r=>r.name===roleName);
                msg.member.roles.add(role).then(()=>msg.reply("You get the NoNFT role."))
                                          .catch(console.error);
                 
            }
        }
        else if(NFTcount>0&&NFTcount<100)
        {
            roleName = "Azero Addict";
            if(!roles.includes(roleName)){
              let role = msg.guild.roles.cache.find(r=>r.name===roleName);
              msg.member.roles.add(role).then(()=>msg.reply("You get the role of "+roleName))
                                        .catch(console.error);
             }
        }
        else if(NFTcount>=100)
        {
            roleName = "manyNFTowner";
            if(!roles.includes(roleName)){
               let role = msg.guild.roles.cache.find(r=>r.name===roleName);
               msg.member.roles.add(role).then(()=>msg.reply("You get the role of "+roleName))
                                        .catch(console.error);
            }
        }
 
    }
    else
    { 
      
      msg.reply(`We have reactivated the verification bots for Telegram and Discord.

                  How do they work?
                  Access the following link: [https://marmosetclub.io/verify](https://marmosetclub.io/verify)
                  Connect your wallet to verify that you have the NFT, and it will generate a code that expires in 15 minutes.

                  What do I do with that code?
                  Once you have the code, you need to send a DM to each of the bots with that code.
                  @marmoset_club_bot on Telegram.
                  Marmoset club#2864 on Discord.

                  Once verified, you will be able to write in the Telegram group and access the private section of Discord.

                  You can complete the verification process from a mobile device using the browser of the Subwallet app or from a computer.

                  If you encounter any issues, send me a DM.`);



    } 
    
  })

  // client.login logs the bot in and sets it up for use. You'll enter your token here.
// client.login logs the bot in and sets it up for use. You'll enter your token here.

async function checkNFTowner(ownerAddress) {
  // console.log("ownerAddress:",ownerAddress);
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
  const arr = data.filter(item => item.listNFT?.length > 0)
            .flatMap(item => item.listNFT ?? []);
  console.log("nftCount:",data);
  return arr.length;
}
module.exports = {
  checkNFTowner
}
client.login(process.env.discordbot);
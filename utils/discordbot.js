  // Import discord.js and create the client
  const { clientAPI, APICall } = require("./getNFT");
  const Discord = require('discord.js')
  const client = new Discord.Client();
  const Verified = require("../models/Verified");
  const config = require("../config/keys");
  const {VerifiCode} = require("./marmosetUtils");
  // Register an event so that when the bot is ready, it will log a messsage to the terminal
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  })

  // Register an event to handle incoming messages
  client.on('message', async msg => {
    // This block will prevent the bot from responding to itself and other bots
    if(msg.author.bot) {
      return
    }
    //-------------------------DM verify---------------------//
    if (msg.channel.type === 'dm') {
      // Handle DM message here
      console.log(`Received DM from ${msg.author.tag}: ${msg.content}`);
      var validWallet = VerifiCode.verify(msg.content);
      console.log(validWallet);
      if (typeof validWallet === "string")
      {
        var verifiedData = await Verified.create({wallet:validWallet,discord:msg.author.tag});
        console.log(verifiedData);
        msg.author.send("Hey there! I received your verification code.You are verified on marmosetClub");
      }else {
        // 0: invalid code
        // 1: time expired
        var messageInvalid = validWallet? "Verification code has been expired.":"It's invalid code. Please create new one.";
        msg.author.send(messageInvalid);
      }
      return;
    }
    //-----------------------------------------------------//
    else {
    // Get the roles of the member who sent the message
    const roles = msg.member.roles.cache.map(role => role.name);
    // Log the roles
    console.log(`Roles of ${msg.author.tag}: ${roles.join(', ')}`);



    const isVerifiedUser = await Verified.findOne({discord:msg.author.tag});
    console.log(isVerifiedUser);
    if(isVerifiedUser)
    {const NFTcount = await checkNFTowner(isVerifiedUser.wallet);
        let msgss = "";
        if(NFTcount===0)
        {msgss = "You no own NFT.";
          let roleName = "NoNFT";
             if(!roles.includes(roleName)){
		            let role = msg.guild.roles.cache.find(r=>r.name===roleName);
                 msg.member.roles.add(role).catch(console.error);
                 msg.reply("You get the NoNFT role.");
             }
        }
        else if(NFTcount>0&&NFTcount<100)
        {
          let roleName = "Azero Addict";
             if(!roles.includes(roleName)){
              let role = msg.guild.roles.cache.find(r=>r.name===roleName);
              msg.member.roles.add(role).then(()=>msg.reply("You get the role of "+roleName))
                                        .catch(console.error);
             }
        }
        else if(NFTcount>=100)
        {
          let roleName = "manyNFTowner";
            if(!roles.includes(roleName)){
               let role = msg.guild.roles.cache.find(r=>r.name===roleName);
               msg.member.roles.add(role).then(()=>msg.reply("You get the role of "+roleName))
                                        .catch(console.error);
            }
        }
        msgss = "You own much NFTs";
    }
    else
    { 
      msg.reply("You have to verify yourself. https://marmosetclub.io/verify");   
    } 
// if(!roles.includes("AAA")){
    //   let roleName = "AAA"; // replace this with the name of your role
    //   let role = msg.guild.roles.cache.find(r => r.name === roleName);
    //   if (!role) {
    //       console.log(`The role ${roleName} does not exist`);
    //       return;
    //   }
    //   // Add the role to the member who sent the message
    //   msg.member.roles.add(role).catch(console.error);
    // }
    // Check if the message starts with '!hello' and respond with 'world!' if it does.
    }
  })

  // client.login logs the bot in and sets it up for use. You'll enter your token here.
// client.login logs the bot in and sets it up for use. You'll enter your token here.

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
  console.log("=================ata = data.filter((item) => item.listNFT?.length > 0)===================");
  console.log(data);
  return data.length>0?data[0].listNFT.length:0;
}

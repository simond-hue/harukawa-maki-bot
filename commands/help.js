const embeds = require('../classes/embeds');

async function sendHelpMessage(channel){
    channel.send(new embeds.HelpEmbed());
}

module.exports.run = async(bot, message, args) =>{
    if(!message.member.dmChannel) message.member.createDM().then(async(channel)=>{
        await sendHelpMessage(channel)
    });
    else sendHelpMessage(message.member.dmChannel);
}

module.exports.help = {
    name: "help",
    type: "general",
    alias: ["h"],
    description: "Elküldi a dokumentációt DM-ben."
}
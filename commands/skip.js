const index = require("../index.js");
const embeds = require("../classes/embeds");
const musicbotconfig = require("../musicbotconfig.json");

module.exports.run = async (bot,message,args)=>{
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy át tudj számot ugrani!"));

    if(index.servers[message.guild.id].queue.length === 0) return message.channel.send(new embeds.ErrorEmbed("Nincs zene a lejátszóban!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`));

    var roles = message.member.roles.cache;
    var djrole = false;

    if(musicbotconfig[message.guild.id]){
        roles.forEach(element => {
            if(element.id === musicbotconfig[message.guild.id].roleid) djrole = true;
        });
    }

    if(message.member.hasPermission('ADMINISTRATOR') || djrole){
        currentServer.skip(message);
    }
    else{
        currentServer.skips++;
        message.channel.send(new embeds.ErrorEmbed(`Átugrás ${currentServer.skips}/${currentServer.getNonBotsOnTheVoiceChannel()}`));
        if(currentServer.skips >= Math.floor(currentServer.getNonBotsOnTheVoiceChannel()/2)){
            currentServer.skip(message);
        }
    }
}
module.exports.help = {
    name: "skip",
    type: "music",
    alias: ["s"],
    description: "Átugorja a jelenlegi zenét a lejátszóban."
}
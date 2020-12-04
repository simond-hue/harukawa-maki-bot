const request = require("request");
const index = require("../index.js");
const embeds = require("../classes/embeds");

module.exports.run = async (bot,message,args)=>{
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy eltávolítsd többször előforduló zenéket!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.queue.length === 0) return message.channel.send(new embeds.ErrorEmbed("Nincs zene a lejátszóban!"));

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    currentServer.removeDupes();

    return message.channel.send(new embeds.ErrorEmbed(`Sikeresen törölted a többször előforduló elemeket!`));
}
module.exports.help = {
    name: "removeduplicates",
    type: "music",
    alias: ["rmdupes", "rmd"],
    description: "Kitörli a redundáns elemeket a lejátszási listáról, és egyszer visszarakja."
}
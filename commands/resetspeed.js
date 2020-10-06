const index = require("../index.js");

module.exports.run = async(bot,message,args) => {
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy tudj sebességet állítani!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`));
    if(currentServer.speed === 1) return message.channel.send(new embeds.ErrorEmbed("A sebesség már alapértelmezett értékre van állítva!"));
    var speed = 1;

    currentServer.setSpeed(speed);
    return message.channel.send(new embeds.ErrorEmbed("A sebesség vissza lett állítva az alapértelmezett értékre!"));
}
module.exports.help = {
    name: "resetspeed",
    type: "music",
    alias: ["rs","resettempo","rt"],
    description: "Visszaállítja a zene lejátszási sebességét a szerveren az alapértelmezett értékre."
}
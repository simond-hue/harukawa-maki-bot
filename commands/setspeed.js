const index = require("../index.js");
const embeds = require('../classes/embeds');

module.exports.run = async(bot,message,args) => {
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy tudj sebességet állítani!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`));

    var speed = message.content.split(' ')[1];

    if(!Number(speed) === speed) return  message.channel.send(new embeds.ErrorEmbed(`A megadott sebesség nem szám formátumú!`));

    if(speed > 2) return message.channel.send(new embeds.ErrorEmbed(`A megadott sebesség a maximumon kívül esik!`));
    if(speed < 0.5) return message.channel.send(new embeds.ErrorEmbed(`A megadott sebesség a minimumon kívül esik!`));    
    if(currentServer.speed === speed) return message.channel.send(new embeds.ErrorEmbed(`A sebesség már be lett állítva erre az értékre: ${speed}x`));
    
    currentServer.setSpeed(speed);
    return message.channel.send(new embeds.ErrorEmbed(`A sebesség ${speed}x-re lett állítva!`));
}
module.exports.help = {
    name: "setspeed",
    type: "music",
    alias: ["ss","settempo","attempo","at","st"],
    description: "Bállítja a zene lejátszási sebességét a szerveren."
}
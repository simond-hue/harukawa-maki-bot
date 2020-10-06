const index = require("../index.js");
const embeds = require("../classes/embeds");

module.exports.run = async(bot,message,args) =>{
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy be tudd kapcsolni a nightcore módot!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    if(currentServer.daycore) currentServer.daycore = false;

    currentServer.nightcore = !currentServer.nightcore;

    switch(currentServer.nightcore){
        case true:
            message.channel.send(new embeds.ErrorEmbed("Nightcore mód bekapcsolva! A nightcore mód a következő számtól érvényes!"));
            break;
        case false:
            message.channel.send(new embeds.ErrorEmbed("Nightcore mód kikapcsolva! A következő szám már nem nightcore módban indul!"));
            break;
    }

}

module.exports.help = {
    name: "nightcore",
    type: "music",
    alias: ["nc"],
    description: "Be -és kikapcsolja a nightcore módot a szerveren."
}
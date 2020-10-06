const index = require("../index.js");
const embeds = require("../classes/embeds");

module.exports.run = async (bot,message,args)=>{
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy be tudd kapcsolni a loopot!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    if(!currentServer.queue[0] && !currentServer.looped){
        return message.channel.send(new embeds.ErrorEmbed("Üres a lejátszási lista!"));
    }

    currentServer.looped = !currentServer.looped;
    
    switch(currentServer.looped){
        case true:
            message.channel.send(new embeds.ErrorEmbed("Loop bekapcsolva!"));
            break;
        case false:
            message.channel.send(new embeds.ErrorEmbed("Loop kikapcsolva!"));
            break;
    }
}

module.exports.help = {
    name: "loop",
    type: "music",
    alias: ["l"],
    description: "Beloopolja az éppen aktuális zenét a lejátszóban."
}
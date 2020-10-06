const index = require("../index");
const embeds = require("../classes/embeds");

module.exports.run = async (bot, message, args) => {
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy be tudd kapcsolni a shuffle módot!"));

    var currentServer = index.servers[message.guild.id];
    if(!currentServer.queue[0] && !currentServer.shuffled) return message.channel.send(new embeds.ErrorEmbed("Üres a lejátszási lista!"));
    
    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    else if(currentServer.queue.length === 1 && !currentServer.shuffled) return message.channel.send(new embeds.ErrorEmbed("Legalább két elemnek szerepelnie kell a lejátszási listán a shuffle mód bekapcsolásához!"));
    else{
        currentServer.shuffled = !currentServer.shuffled;
        switch(currentServer.shuffled){
            case true:
                message.channel.send(new embeds.ErrorEmbed("Shuffle mód bekapcsolva!"));
                break;
            case false:
                currentServer.clearUntilCurrentSong();
                message.channel.send(new embeds.ErrorEmbed("Shuffle mód kikapcsolva!"));
                break;
        }
        return;
    }
}

module.exports.help = {
    name: "shuffle",
    type: "music",
    alias: ["shuff"],
    description: "Végtelenített véletlenszerű lejátszási listát hoz létre a jelenlegi lejátszási listából."
}
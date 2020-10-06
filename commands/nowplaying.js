const index = require("../index");
const embeds = require("../classes/embeds");

module.exports.run = async(bot,message,args)=>{
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    var currentServer = index.servers[message.guild.id];

    if(!currentServer.queue[0] || !currentServer.voiceConnection.dispatcher) return message.channel.send(new embeds.ErrorEmbed("Nincs zene a lejátszóban!"));

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    await currentServer.nowPlaying(message.channel);
}

module.exports.help = {
    name: "nowplaying",
    type: "music",
    alias: ["np"],
    description: "A lejátszóban lévő zenének az adatait adja vissza."
}
const index = require("../index");
const embeds = require("../classes/embeds");

module.exports.run = async (bot,message,args) =>{
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));
    
    if(currentServer.queue.length === 0) return message.channel.send(new embeds.ErrorEmbed("Nincs zene a lejátszási listán!"));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    currentServer.page = Math.floor(currentServer.SHI/10);
    await currentServer.getQueue();
}

module.exports.help = {
    name: "queue",
    type: "music",
    alias: ["q"],
    description: "Visszaadja a jelenlegi lejátszási listán lévő zenék adatait"
}
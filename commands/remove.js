const index = require('../index');
const embeds = require('../classes/embeds');

module.exports.run = async (bot, message, args) =>{
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy át tudj számot ugrani!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    var ind = (message.content.split(' ')[1]);
    ind--;
    console.log(ind);

    if(!ind && ind !== 0) return message.channel.send(new embeds.ErrorEmbed(`Túl kevés argumentum!`));

    if(ind < 0 || ind > currentServer.length-1) return message.channel.send(new embeds.ErrorEmbed(`Nem megfelelő indexet adtál meg!`));

    if(ind === 0) return message.channel.send(new embeds.ErrorEmbed(`A jelenlegi zeneszámot nem lehet törölni! Használd a skip parancsot!`));

    currentServer.delete(ind);

    return message.channel.send(new embeds.ErrorEmbed('Sikeres törlés!'));
}

module.exports.help = {
    name: "remove",
    type: "music",
    alias: ["rm"],
    description: "Kitörli a megadott indexedik elemet a lejátszási listáról."
}
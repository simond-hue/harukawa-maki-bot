const server = require("../classes/server.js");
const fs = require('fs');
var index = require("../index.js");
const embeds = require("../classes/embeds");

module.exports.run = async (bot, message, args) => {
    if(!message.guild.me.hasPermission('CONNECT')) return message.channel.send(new embeds.ErrorEmbed("Nincs jogom csatlakozni a voice channelhez!"));

    if(!message.guild.me.hasPermission('SPEAK')) return message.channel.send(new embeds.ErrorEmbed(`Nincs jogom a beszédhez a ${index.servers[message.guild.id].voiceChannel.name} szobában!`)); //ez bugos valszeg

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy meg tudj idézni!"));
    
    if(message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Már voice channelen vagyok!"));

    var s = new server.Server(message,bot);
    if(s.id === '624289705298755615') createFile();
    if(!index.servers[s.id]){
        await s.voiceChannel.join();
        s.voiceConnection = message.guild.me.voice.connection;
        s.voiceConnection.voice.setSelfDeaf(true);
        index.servers[s.id] = s;
        await message.channel.send(new embeds.ErrorEmbed(`Csatlakoztam a(z) ${s.voiceChannel.name} channelre!`));
        await message.channel.send(new embeds.ErrorEmbed(`A parancsokat mostantól a ${s.channel.name} szobában lehet megadni!`));
    }
}

function createFile(){
    return fs.closeSync(fs.openSync("./nowplaying.txt", 'w'))
}

module.exports.help = {
    name: "summon",
    type: "music",
    alias: ["connect", "join"],
    description: "Behívja a botot a voice channelre."
}
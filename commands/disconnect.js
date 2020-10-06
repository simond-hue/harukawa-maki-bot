const Discord = require("discord.js");
const fs = require('fs');

const index = require("../index.js");
const embeds = require("../classes/embeds");

module.exports.run = async (bot,message,args)=>{
    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy le tudj csatlakoztatni!"))

    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    if(currentServer.id === '624289705298755615') deleteFile();
    await message.channel.send(new Discord.MessageEmbed()
        .setColor("#de374e")
        .setTitle("Lecsatlakozva!"));
    return currentServer.disconnect();
}

function deleteFile(){
    return fs.unlink("./nowplaying.txt",err=>{
        if(err) console.log(err);
        return;
    });
}

module.exports.help = {
    name: "disconnect",
    type: "music",
    alias: ["dc", "fuckoff"],
    description: "Lecsatlakoztatja a botot a voice channelről."
}
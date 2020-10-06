const index = require("../index");
const embeds = require("../classes/embeds");

module.exports.run = async(bot,message,args) => {
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy be tudd kapcsolni a bassboost-ot!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    currentServer.bassboosted = !currentServer.bassboosted;
    switch(currentServer.bassboosted){
        case true:
            message.channel.send(new embeds.ErrorEmbed("Bassboost mód bekapcsolva! A bassboost mód a következő számtól érvényes!"));
            break;
        case false:
            message.channel.send(new embeds.ErrorEmbed("Bassboost mód kikapcsolva! A következő szám már nem bassboost módban indul!"));
            break;
    }
}

module.exports.help = {
    name: "bassboost",
    type: "music",
    alias: ["bb"],
    description: "A zenében lévő alacsony frekvenciákat hangosabbá teszi."
}
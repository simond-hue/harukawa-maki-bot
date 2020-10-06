var index = require("../index.js");
var embeds = require("../classes/embeds");

module.exports.run = async (bot, message, args) =>{
    if(!index.servers[message.guild.id]) await bot.commands.get("summon").run(bot,message,args);

    var vidID = null;
    var content = message.content.split(' ')[1];

    if(!content) return message.channel.send(new embeds.ErrorEmbed(`Üres argumentum!`));

    if(content.startsWith('https://www.youtube.com/watch?')) vidID = content.split('?')[1].substr(2);
    else if(content.startsWith('https://youtu.be/')) vidID = content.substr(16);
    
    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel.id !== message.channel.id) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));
    
    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    if(vidID !== null){
        if(!vidID.match(/[a-zA-Z0-9_-]{11}/g)) return message.channel.send(new embeds.ErrorEmbed("A megadott link nem megfelelő formátumú!"));
        await currentServer.createSong(message);
    }
    else if(content.startsWith('https://www.youtube.com/playlist?list=')){
        var listID = content.split('?')[1].substr(5);
        if(!listID.match(/[a-zA-Z0-9_-]/g)) return message.channel.send(new embeds.ErrorEmbed("A megadott link nem megfelelő formátumú!"));
        await currentServer.searchPlaylist(message, listID);
            
    }
    else if(vidID === null && !content.startsWith('https://www.youtube.com/')){
        await currentServer.searchFirst(message);
    }
}

module.exports.help = {
    name: "play",
    type: "music",
    alias: ["p"],
    description: "Lejátsza a megadott zenét."
}
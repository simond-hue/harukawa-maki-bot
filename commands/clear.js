const index = require('../index');
const embeds = require('../classes/embeds');
const musicbotconfig = require('../musicbotconfig.json');

module.exports.run = (bot,message,args) => {
    if(!message.guild.me.voice.connection) return message.channel.send(new embeds.ErrorEmbed("Nem vagyok voice channelen!"));

    if(!message.member.voice.channel) return message.channel.send(new embeds.ErrorEmbed("Voice channelben kell lenned, hogy ki tudd üríteni a lejátszási listát!"));

    var currentServer = index.servers[message.guild.id];

    if(currentServer.channel !== message.channel) return message.channel.send(new embeds.ErrorEmbed(`A parancsokat a(z) ${currentServer.channel.name} szobában lehet használni!`));

    if(!currentServer.APIrequestDONE) return message.channel.send(new embeds.ErrorEmbed("A lejátszási lista még töltődik!"));

    if(currentServer.voiceChannel.id !== message.member.voice.channel.id) return message.channel.send(new embeds.ErrorEmbed(`Nem vagyunk ugyanabban a szobában! Jelenleg a(z) ${currentServer.voiceChannel.name} szobában vagyok!`))

    var roles = message.member.roles.cache;
    var djrole = false;

    if(musicbotconfig[message.guild.id]){
        roles.forEach(element => {
            if(element.id === musicbotconfig[message.guild.id].roleid) djrole = true;
        });
    }

    if(message.member.hasPermission('ADMINISTRATOR') || djrole){
        currentServer.clear();
        return message.channel.send(new embeds.ErrorEmbed('A lejátszási lista törölve!'));
    }
    else{
        var rolename = message.guild.roles.fetch(musicbotconfig[message.guild.id].roleid).then(role => { return role.name });
        return message.channel.send(new embeds.ErrorEmbed(`Nincs DJ rangod! A szerveren a(z) ${rolename} a DJ rang`));
    }
   
}

module.exports.help = {
    name: "clear",
    type: "music",
    alias: ["c"],
    description: "Kiüríti a lejátszási listát."
}
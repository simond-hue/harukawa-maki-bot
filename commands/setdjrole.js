const embeds = require("../classes/embeds");
const fs = require("fs");

var musicbotconfig = require("../musicbotconfig.json");
const { rejects } = require("assert");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(new embeds.ErrorEmbed("Nincs meg a megfelelő jogköröd!"));
    if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(new embeds.ErrorEmbed("Nincs meg a megfelelő jogköröm (MANAGE_ROLES)!")); 

    var djRoleName = message.content.split(' ');
    djRoleName.shift();
    djRoleName = djRoleName.join(' ');

    if(!djRoleName) return message.channel.send(new embeds.ErrorEmbed("Nem adtál meg role nevet!"));

    var role = null;
    var roles = message.guild.roles.cache;

    roles.forEach(element => {
        if(element.name.toUpperCase() === djRoleName.toUpperCase()){
            role = element;
        }
    });

    if(role !== null){
        var embed = await _setRole(role,message.guild.id,message.guild.roles);
        return message.channel.send(embed);
    }     
    else if(role === null){
        var embed = await _createRole(djRoleName,message.guild.id,message.guild.roles);
        return message.channel.send(embed);
    }  
}

async function _createRole(djRoleName,serverid,roles){
    if(!musicbotconfig[serverid]) musicbotconfig[serverid] = {};
    if(musicbotconfig[serverid].roleid && musicbotconfig[serverid].created){
        roles.fetch().then(roles =>{
            roles.cache.get(musicbotconfig[serverid].roleid).delete();
        });
    }

    await roles.create({
        data:{
            name: djRoleName,
            color: "DEFAULT"
        }
    })
    .then((role)=>{
        musicbotconfig[serverid].roleid = role.id;
        musicbotconfig[serverid].created = true;
        _save(musicbotconfig);
    })
    .catch(err =>{ console.log(err) });
    return new embeds.ErrorEmbed("Új DJ Role létrehozva!");
    
}

async function _setRole(role,serverid,roles){
    if(!musicbotconfig[serverid]) musicbotconfig[serverid] = {};
    else if(musicbotconfig[serverid].created){
        await roles.cache.get(musicbotconfig[serverid].roleid).delete();
    }
    musicbotconfig[serverid].roleid = role.id;
    musicbotconfig[serverid].created = false;
    _save(musicbotconfig);
    return new embeds.ErrorEmbed(`Felülírva! ${role.name} mostantól a DJ role!`);
}

function _save(musicbotconfig){
    var writeableJSON = JSON.stringify(musicbotconfig, null, 2);
    fs.writeFileSync("musicbotconfig.json",writeableJSON,(err)=>{
        if(err) console.log(err);
    });
    return;
}

module.exports.help = {
    name: "setdjrole",
    type: "music",
    alias: ["setdj", "sdj"],
    description: "A megadott role-t DJ role-lá teszi."
}
const Discord = require("discord.js");
const embeds = require("../classes/embeds");

module.exports.run = async (bot, message, args) => {
    var messsageArray = message.content.split(' ');
    messsageArray.shift();
    if(messsageArray.length === 0) return await message.channel.send(new embeds.ErrorEmbed("Nem adtál meg üzenetet!"));
    var string = messsageArray.join(' ');
    var endstring = "";
    for(var i = 0; i < string.length; i++){
        if(string.charAt(i) != ' '){
            var random = Math.round(Math.random());
            if(random == 1){
                if(string.charAt(i) == string.charAt(i).toLowerCase()) endstring += string.charAt(i).toUpperCase();
                else endstring += string.charAt(i).toLowerCase();
            }
            else endstring += string.charAt(i);
        }
        else endstring += " ";
    }
    return await message.channel.send(endstring);
}
module.exports.help = {
    name: "random",
    type: "fun"
}
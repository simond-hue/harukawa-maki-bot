const embeds = require('../classes/embeds');
const colorcollector = require('../classes/colorcollector');

module.exports.run = async(bot,message,args) => {
    var color = message.content.split(' ')[1];

    if(!color) return message.channel.send(new embeds.ErrorEmbed('Üres argumentum!'));

    if(message.content.split.length > 2) return message.channel.send(new embeds.ErrorEmbed('Túl sok argumentum!'));

    if(!color.match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i)) return message.channel.send(new embeds.ErrorEmbed('Nem hexa kódot adtál meg!'));

    return await message.channel.send(new embeds.ColorEmbed(color)).then(msg =>{
        new colorcollector.ColorCollector(msg, color, message.member);
    })
}

module.exports.help = {
    name: "color",
    type: "color",
    alias: [],
    description: "Beállítja a felhasználó nevének a színét a szerveren."
}
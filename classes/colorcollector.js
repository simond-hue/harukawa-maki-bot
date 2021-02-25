const Discord = require("discord.js");

const embeds = require('./embeds');

module.exports.ColorCollector = class ColorCollector extends Discord.ReactionCollector{
    constructor(message, hex, requestedBy){
        const filter = (reaction, user) => (
            (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === requestedBy.id);
        super(message,filter,{time: 30000, max: 1});

        this._message = message;
        this._guild = message.guild;
        this._hex = hex;
        this._requestedBy = requestedBy;

        this.on('collect',reaction =>{
            if(reaction.emoji.name === '✅'){
                this._collect();
                this._message.channel.send(new embeds.ErrorEmbed('Sikeres változtatás!'));
            }
            else if(reaction.emoji.name === '❌'){
                this._message.channel.send(new embeds.ErrorEmbed('Névszín nem lett megváltoztatva!'));
            }
            this._end();
        });

        this.on('end',(collected)=>{
            if(collected.size === 0){
                this._end();
                this._message.channel.send(new embeds.ErrorEmbed('Időtúllépés...'))
            } 
        })

        this._react();

    }

    async _react(){
        await this._message.react('✅');
        await this._message.react('❌');
    }

    async _end(){
        await this._message.delete(); 
    }

    async _collect(){
        const data = {
            data: {
                name: `USER-${this._requestedBy.id}`,
                color: this._hex,
            }
        }

        var exists = false;
        var role = null;
        this._message.guild.roles.cache.forEach(element => {
            if(element.name === `USER-${this._requestedBy.id}`){
                exists = true;
                role = element;
            }
        });

        if(exists) await role.delete();
        await this._guild.roles.create(data).then(r =>{
            this._requestedBy.roles.add(r);
        });
    }
}
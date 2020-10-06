const Discord = require('discord.js');

module.exports.QueueReactionCollector = class QueueReactionCollector extends Discord.ReactionCollector{
    constructor(message,emotes, time, server){
        const filter = (reaction, user) => (
            (emotes.includes(reaction.emoji.name)) && user.id !== '720426327869751298');
        super(message,filter,{time: time, max: 1});

        this._server = server;
        this._emotes = emotes;

        this._react();

        this.on('collect',reaction =>{
            this._collect(reaction);
        });

        this.on('end',(collected)=>{
            this._end(collected);
        })

    }

    async _collect(reaction){
        switch(reaction.emoji.name){
            case '⬅️':
                this._server.page--;
                this._paging();
                break;
            case '➡️':
                this._server.page++;
                this._paging();
                break;
            case '⏪':
                this._server.page = 0;
                this._paging();
                break;
            case '⏩':
                this._server.page = Math.floor(this._server.queue.length/10);
                this._paging();
                break;
        }
    }

    async _end(collected){
        if(collected.size === 0){
            await this.message.reactions.removeAll();
        }
    }

    async _react(){
        for(var i = 0; i < this._emotes.length; i++){
            await this.message.react(this._emotes[i]);
        }
    }

    async _paging(){
        await this.message.reactions.removeAll();
        await this.message.delete();
        await this._server.getQueue();
    }

    async destroy(){
        this.stop();
        this._server.paginator = null;
    }
}
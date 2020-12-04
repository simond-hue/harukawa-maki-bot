const ytdl = require("ytdl-core");

const exceptions = require("./exceptions");
const embeds = require("./embeds");
const index = require("../index");

module.exports.Song = class Song{
    constructor(link, requestedBy, requestedByPFP, message){
        this.link = link;
        this.information = null;
        this.requestedBy = requestedBy;
        this.requestedByPFP = requestedByPFP;
        this.server = index.servers[message.guild.id];

        this._setVideoId();
    }

    async getInfo(retries = 2){
        await new Promise(async(resolve,reject)=>{
            try{
                var info = await ytdl.getInfo(this.link).catch(err =>{
                    if(err.message === "Video unavailable"){
                        throw new exceptions.SongIsNotAvailable('A videó nem elérhető!');
                    }
                    if(err.statusCode === 403) throw new exceptions.SongIsNotAvailable('A videóhoz nincs hozzáférés!');
                    if(err.message === 'This is a private video. Please sign in to verify that you may see it.'){
                        throw new exceptions.SongIsNotAvailable('A videó privát!');
                    }
                    else{
                        console.log(err);
                        return;
                    }
                });
                resolve(info);
                if(!info){ return; }
                this.information = info;
                this.title = info.videoDetails.title;
                this.thumbnail = info.player_response.videoDetails.thumbnail.thumbnails[0].url;
                this.isLive = info.player_response.videoDetails.isLive;
                this.formats = info.formats;
                this.length = info.videoDetails.lengthSeconds;
            }
            catch(err){
                if(err instanceof exceptions.SongIsNotAvailable){
                    await this.server.channel.send(new embeds.ErrorEmbed(err.message));
                    if(!this.server.voiceConnection.dispatcher && this.server.queue[this.server.SHI]) this.server.skip();
                }
                else if(err.message === 'Too many redirects.' || err.message === 'The user aborted a request.'){
                    await this.serrver.channel.send(new embeds.ErrorEmbed("Hiba történt! Átugrás..."));
                    if(this.isLive)
                        await this.server.songFinish();
                    else
                        await this.server.skip();
                }
                else if(err.message.includes('Unable to retrieve video metadata') && retries > 0){
                    await this.getInfo(retries-1);
                }
                else{
                    console.log(err);
                    await this.serrver.channel.send(new embeds.ErrorEmbed("Hiba történt! Átugrás..."));
                    this.server.skip();
                }
            }
        })
    }

    _setVideoId(){
        this.videoId = this.link.split('?')[1].substr(2,13);
    }

    clear(){
        this.information = null;
        this.title = null;
        this.thumbnail = null;
        this.isLive = null;
        this.formats = null;
        this.length = null;
    }

    equals(o) {
        return this.videoId === o.videoId;
    }
}


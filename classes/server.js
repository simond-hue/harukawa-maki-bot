const ytdl = require("ytdl-core");
const request = require("request");
const prism = require("prism-media");
const fs = require('fs');

const song = require("../classes/song");
const embeds = require("../classes/embeds");
const exceptions = require("../classes/exceptions");
const botconfig = require("../botconfig.json");
const queuepaginator = require("./queuepaginator.js");

const FREQUENCY = 120;
const GAIN = 20;
const TREBLEGAIN = 4;

var index = require("../index");
const { listenerCount } = require("process");

module.exports.Server = class Server{
    constructor(message,bot){
        this.id = message.guild.id;
        this.queue = [];
        this.voiceChannel = message.member.voice.channel; 
        this.voiceConnection = message.member.voice.connection;
        this.skips = 0;
        this.page = 0;
        this.looped = false;
        this.shuffled = false;
        this.SHI = 0;
        this.nightcore = false;
        this.daycore = false;
        this.channel = message.channel;
        this.bassboosted = false;
        this.APIrequestDONE = true;
        this.servername = message.guild.name;
        this.previuslyPlayed = [];
        this.prevSkips = 0;
        this.paginator = null;
        this.speed = 1;
        this.transcoder = null;
        this._playedSong = false;
        this._ranNoUserInVoiceChannelAmount = 0;

        this._connectionTimeout = setTimeout(() => {
            if(this.queue.length === 0){
                this.channel.send(new embeds.ErrorEmbed('Időtúllépés...'))
                this.disconnect();
            }
        }, 300000);

        this._endSongTimeout = null;

        this._noUserInVoiceChannelTimeout = null;

        bot.on("voiceStateUpdate",(oldState, newState)=>{
            if(oldState.member === message.guild.me){
                if(oldState.channelID){
                    this.voiceChannel = newState.channel;
                    if(this._noUserInVoiceChannelTimeout && this.getNonBotsOnTheVoiceChannel() > 0) 
                        clearTimeout(this._noUserInVoiceChannelTimeout);
                    else if(!this._noUserInVoiceChannelTimeout && this.getNonBotsOnTheVoiceChannel() == 0)
                        this._noUserInVoiceChannelTimeout = setTimeout(() => {
                            this.channel.send(new embeds.ErrorEmbed('Időtúllépés...'));
                            this.disconnect();
                        }, 300000);
                }
                if(newState.channelID === null){
                    this._destroy();
                }
            }
            if(!newState.member.user.bot){
                if(this.voiceChannel){
                    if(oldState.channelID === this.voiceChannel.id){
                        if(this._playedSong && this._ranNoUserInVoiceChannelAmount === 0){
                            this._ranNoUserInVoiceChannelAmount++;
                            if(this.getNonBotsOnTheVoiceChannel() === 0){
                                this._noUserInVoiceChannelTimeout = setTimeout(() => {
                                    this.channel.send(new embeds.ErrorEmbed('Időtúllépés...'));
                                    this.disconnect();
                                }, 300000);
                            }
                        }
                    }
                    else if(oldState.channelID !== this.voiceChannel.id){
                        if(this._noUserInVoiceChannelTimeout){
                            clearTimeout(this._noUserInVoiceChannelTimeout);
                        }
                    }
                }
            }
        })
    }

    async disconnect(){
        if(this.transcoder) this.transcoder.destroy();
        this.voiceConnection.disconnect();
        this._destroy();
    }

    _destroy(){
        if(this._connectionTimeout !== null) clearTimeout(this._connectionTimeout);
        if(this._endSongTimeout !== null) clearTimeout(this._endSongTimeout);
        if(this._noUserInVoiceChannelTimeout !== null) clearTimeout(this._noUserInVoiceChannelTimeout);

        delete index.servers[this.id];
    }

    async _playSong(){
        if(this.queue[this.SHI].link === 'D:/Harukawa_bot/megakarokhalni2.mp3') return;
        if(this.channel.deleted){
            this.voiceConnection.disconnect();
            delete index.servers[this.id].instance;
            delete index.servers[this.id];
        }
        if(!this.queue[this.SHI].information){ //PLAYLIST ELEMENTEKNEK NINCS ALAPBÓL METADATÁJUK, OPTIMALIZÁCIÓ MIATT
            await this.queue[this.SHI].getInfo();
        }
        if(!this.queue[this.SHI].information){
            await this.channel.send(new embeds.ErrorEmbed('Hiba történt a lekérdezés során. Átugrás...'));
            this.skip();
        }
        var stream = null;
        await new Promise(async(resolve,reject)=>{
            this.queue[this.SHI].isLive ? stream = await this._Livestream() : stream = await this._NormalVideo();
            resolve(stream);
        })
        .then(async()=>{
            if(this.nightcore) this._modifyStreamSampleRate(stream,36000);
            else if(this.daycore) this._modifyStreamSampleRate(stream,60000);
            else this._modifyStreamSampleRate(stream,48000);

            await this.voiceConnection.play(stream);

            this.voiceConnection.dispatcher.setBitrate('auto');

            this.voiceConnection.dispatcher.on("start",async()=>{
                await this._songStart();
            });
            this.voiceConnection.dispatcher.on("finish",async()=>{
                await this.songFinish();
            });
            this.voiceConnection.dispatcher.on("error", (error)=>{
                if(error.message.includes('Video unavailable')){
                    this.channel.send(new embeds.ErrorEmbed('A videó nem elérhető!'));
                    this.skip();
                }
                else{
                    console.log(error + "\n" + this.queue[this.SHI].link);
                    this.skip();
                }
            });
        })
    }

    _writeTitle(title){
        fs.writeFileSync('./nowplaying.txt',title)
    }

    _emptyFile(){
        fs.writeFileSync("./nowplaying.txt","");
    }

    async createSong(message, givenLink){
        var link = null;
        if(typeof givenLink === "undefined")        link = message.content.split(' ')[1];
        else if(typeof givenLink !== "undefined")   link = givenLink;

        var requestedBy = message.member.displayName;
        var requestedByPFP = `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png`

        var music = new song.Song(link,requestedBy,requestedByPFP,message);

        await music.getInfo();

        this.queue.push(music);
        if(this.queue.length === 1) this._playSong();
        else message.channel.send(new embeds.RequestedSongEmbed(music));
    }

    _createSongsFromPlaylist(message, link){ //KÜLÖN PLAYLIST ELEMENTEKRE KÜLÖN SONG OBJEKTUMOT KÉSZÍT
        var requestedBy = message.member.displayName;
        var requestedByPFP = `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png`

        var music = new song.Song(link,requestedBy,requestedByPFP,message);

        this.queue.push(music);
        if(this.queue.length === 1) this._playSong();
    }

    async searchFirst(message){
        var url = "https://www.googleapis.com/youtube/v3/search?part=id";
        var q = message.content.split(' ');
        var results = 1;
        q.shift();
        if(q.length > 1) q = q.join('+');
        else q = q[0];
        
        q = encodeURIComponent(q);

        request(`${url}&q=${q}&type=video&key=${botconfig.YOUTUBE_API_KEY}&maxResults=${results}`,(error,response,data)=>{
            try{
                if(!response) throw new exceptions.UnexpectedAPIResponse("Unexpected API response!");
                if(response.statusCode === 400) throw new exceptions.BadRequest("Bad Request!");
                if(response.statusCode === 200){
                    var data = JSON.parse(response.body);
                    if(Object.keys(data.items).length === 0) throw new exceptions.NoVideoFound("No video found!");
                    var link = `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
    
                    this.createSong(message,link);
                }
            }
            catch(error){
                if(error instanceof exceptions.UnexpectedAPIResponse)   return message.channel.send(new embeds.ErrorEmbed("Váratlan hiba történ!"));
                if(error instanceof exceptions.BadRequest)              return message.channel.send(new embeds.ErrorEmbed("Hiba történt az API lekérdezés során! Szólj Nidának!"));
                if(error instanceof exceptions.NoVideoFound)            return message.channel.send(new embeds.ErrorEmbed("Nem volt találat!"));
            }
        });
        
    }

    async searchPlaylist(message, listID, token){
        this.APIrequestDONE = false;
        var pageToken = "";
        if(typeof token !== "undefined") pageToken = `pageToken=${token}`;
        var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet';
        var results = 50;

        request(`${url}&maxResults=${results}&playlistId=${listID}&key=${botconfig.YOUTUBE_API_KEY}&${pageToken}`,async (error,response,data)=>{
            try{
                if(!response) throw new exceptions.UnexpectedAPIResponse("Unexpected API response!");
                if(response.statusCode === 400) throw new exceptions.BadRequest("Bad Request!");
                if(response.statusCode === 404) throw new exceptions.NoVideoFound("Playlist not found!");
                if(response.statusCode === 200){
                    var data = JSON.parse(response.body);
                    
                    if(Object.keys(data.items).length === 0) throw new exceptions.EmptyPlaylist("Empty playlist!");
    
                    data.items.forEach(item => {
                        var currentItemLink = `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`;
                        this._createSongsFromPlaylist(message, currentItemLink);
                    });
    
                    if(data.hasOwnProperty("nextPageToken")){
                        this.searchPlaylist(message, listID, data.nextPageToken);
                    }
                    else{
                        this.APIrequestDONE = true;
                        await message.channel.send(new embeds.ErrorEmbed(`${data.pageInfo.totalResults} szám lett hozzáadva a lejátszási listához!`))
                    }
                }
            }
            catch(error){
                if(error instanceof exceptions.UnexpectedAPIResponse)   return message.channel.send(new embeds.ErrorEmbed("Váratlan hiba történ!"));
                if(error instanceof exceptions.BadRequest)              return message.channel.send(new embeds.ErrorEmbed("Hiba történt az API lekérdezés során! Szólj Nidának!"));
                if(error instanceof exceptions.NoVideoFound)            return message.channel.send(new embeds.ErrorEmbed("Nem volt találat!"));
                if(error instanceof exceptions.EmptyPlaylist)           return message.channel.send(new embeds.ErrorEmbed("Üres playlist!"));
            }
        });
    }

    async skip(message){
        this.looped = false;
        await this.songFinish();
        if(typeof message !== "undefined") await message.channel.send(new embeds.ErrorEmbed("Átugorva!"));
    }

    getNonBotsOnTheVoiceChannel(){
        var count = 0;
        if(this.voiceChannel)
            this.voiceChannel.members.forEach(member => {
                if(!member.user.bot){
                    count++;
                }
            });
        return count;
    }

    async songFinish(){
        this.previuslyPlayed.push(this.queue[this.SHI]);
        if(this.previuslyPlayed.length === 100) this.previuslyPlayed.shift();
        if(this.queue[this.SHI]) this.queue[this.SHI].clear();
        if(this.voiceConnection.dispatcher) this.voiceConnection.dispatcher.destroy();
        if(this.looped && this.shuffled) this.shuffled = false;
        if(!this.shuffled && !this.looped) this.queue.shift();
        if(this.shuffled) this.SHI = Math.floor(Math.random() * this.queue.length);
        this.page = Math.floor(this.SHI/10);
        this.skips = 0;
        this.prevSkips = 0;
        this._endSongTimeout = setTimeout(() => {
            if(this.queue.length === 0){
                this.channel.send(new embeds.ErrorEmbed('Időtúllépés...'));
                this.disconnect();
            }
        }, 300000);
        if(this.id === '624289705298755615') this._emptyFile();
        if(this.transcoder) this.transcoder.destroy();
        if(this.queue[this.SHI]){
            this._playSong();
        }
    }

    async _songStart(){
        this._playedSong = true;
        if(this.voiceConnection.channel.id !== this.voiceChannel.id) this.voiceConnection.channel = this.voiceChannel;
        if(!this.looped || this.queue[this.SHI].isLive) await this.channel.send(new embeds.SongEmbed(this.queue[this.SHI]));
        console.log("\x1b[36m%s\x1b[0m",this.id + ": ", this.queue[this.SHI].link);
        if(this._connectionTimeout) clearTimeout(this._connectionTimeout);
        if(this._endSongTimeout) clearTimeout(this._endSongTimeout);
        if(this.id === '624289705298755615') this._writeTitle(this.queue[this.SHI].title);
    }

    async _setPrevsongFinishCurrent(){
        if(this.queue[this.SHI]) this.queue[this.SHI].clear();
        if(this.voiceConnection.dispatcher) this.voiceConnection.dispatcher.destroy();
        if(this.looped && this.shuffled) this.shuffled = false;
        if(this.shuffled){
            var prevSong = this.previuslyPlayed.pop();
            this.SHI = this.queue.indexOf(prevSong);
        }
        else{
            this.queue.unshift(this.previuslyPlayed.pop());
            this.SHI = 0;
        }
        this.page = Math.floor(this.SHI/10);
        this.skips = 0;
        this.prevSkips = 0;
    }

    _modifyStreamSampleRate(stream, amount){
        var arg;
        if(this.bassboosted)
            if(this.nightcore) arg = ['-analyzeduration', '0',"-filter:a", `loudnorm,treble=g=${TREBLEGAIN},equalizer=f=1:width_type=h:width=${Math.round(FREQUENCY*1.25)}:g=${GAIN},atempo=${this.speed}`,'-loglevel', '0', '-f', 's16le', '-ar', amount, '-ac', '2']
            else if(this.daycore) arg = ['-analyzeduration', '0',"-filter:a", `loudnorm,treble=g=${TREBLEGAIN},equalizer=f=1:width_type=h:width=${Math.round(FREQUENCY*0.75)}:g=${GAIN},atempo=${this.speed}`,'-loglevel', '0', '-f', 's16le', '-ar', amount, '-ac', '2']
            else arg = ['-analyzeduration', '0',"-filter:a", `loudnorm,treble=g=${TREBLEGAIN},equalizer=f=1:width_type=h:width=${FREQUENCY}:g=${GAIN},atempo=${this.speed}`,'-loglevel', '0', '-f', 's16le', '-ar', amount, '-ac', '2']
        else arg = ['-analyzeduration', '0',"-filter:a", `loudnorm,treble=g=${TREBLEGAIN},atempo=${this.speed}`,'-loglevel', '0', '-f', 's16le', '-ar', amount, '-ac', '2'];
        this.transcoder = new prism.FFmpeg({
            args: arg
        });
        stream.pipe(this.transcoder);
    }
    //_Livestream still bugged, cuz it skips after like 5 hrs or so, its random idk why have to fix it
    async _Livestream(){
        this.nightcore = false;
        this.daycore = false;
        var stream = ytdl.downloadFromInfo(this.queue[this.SHI].information, { isHLS: true, dlChunkSize: 0, liveBuffer: 1000, highWaterMark:1<<25});
        return stream;
    }

    async _NormalVideo(){
        var stream;
        await new Promise((resolve, reject)=>{
            resolve(stream = ytdl.downloadFromInfo(this.queue[this.SHI].information,{filter: 'audioonly',quality:'highestaudio',highWaterMark:1<<25}))
        })
        .catch((err)=>{
            if(err.message === "No such format found: highestaudio") stream = ytdl.downloadFromInfo(this.queue[this.SHI].information,{filter: 'audioonly',highWaterMark:1<<25});
        });
        return stream;
    }

    async nowPlaying(channel){
        await channel.send(new embeds.NowPlayingEmbed(this.queue[this.SHI],Math.floor(this.voiceConnection.dispatcher.streamTime/1000)));
    }

    clear(){
        var currentSong = this.queue[this.SHI];
        this.queue.length = 0;
        this.queue.push(currentSong);
        this.SHI = 0;
        if(this.shuffled) this.shuffled = !this.shuffled;
        if(this.looped) this.looped = !this.looped;
    }

    clearUntilCurrentSong(){
        this.queue = this.queue.slice(this.SHI);
        this.SHI = 0;
    }

    async getQueue(){
        var songPromises = [];
        for(var i = this.page*10; i < this.page*10+10; i++){
            if(this.queue[i]){
                if(!this.queue[i].information){
                    songPromises.push(new Promise((resolve, reject)=>{
                        resolve(this.queue[i].getInfo());
                    }));
                }
            }
            else break;
        }
        var queueEmbed = new embeds.QueueEmbed(this.servername,this.queue.length,this.page);
        Promise.allSettled(songPromises)
            .then(()=>{
                queueEmbed.nowPlayingDisplay((this.SHI+1),this.queue[this.SHI]);
                queueEmbed.addTitle();
                for(var i = this.page*10; i < this.page*10+10; i++){
                    if(this.queue[i]){
                        if(!this.queue[i].information) queueEmbed.addField("*A videó nem elérhető*");
                        else queueEmbed.addSong((i+1),this.queue[i]);
                    }
                    else break;
                }
                return this.channel.send(queueEmbed).then(async(message)=>{
                    if(this.queue.length>10){
                        if(this.paginator) await this.paginator.destroy();
                        switch(this.page){
                            case 0:
                                this.paginator = new queuepaginator.QueueReactionCollector(message,['➡️','⏩'],this._remainingTime(),this);
                                break;
                            case Math.floor(this.queue.length/10):
                                this.paginator = new queuepaginator.QueueReactionCollector(message,['⏪','⬅️'],this._remainingTime(),this);
                                break;
                            default:
                                this.paginator = new queuepaginator.QueueReactionCollector(message,['⏪','⬅️','➡️','⏩'],this._remainingTime(),this);
                                break;
                        }
                    }
                });
            })
    }

    _remainingTime(){
        return this.queue[this.SHI].length*1000 - this.voiceConnection.dispatcher.streamTime;
    }

    playPreviousSong(){
        this._setPrevsongFinishCurrent();
        if(this.queue[this.SHI]) this._playSong();
    }

    setSpeed(s){
        this.speed = s;
    }

    delete(index){
        this.queue.splice(index,1);
    }

    removeDupes(){
        var removedDupes = [];
        this.queue.forEach(song =>{
            if(!this._containsElement(removedDupes, song)) removedDupes.push(song);
        });
        this.queue = removedDupes;
    }

    _containsElement(list, item){
        var contains = false;
        var i = 0;
        while(i < list.length && !contains) {
            var song = list[i];
            if(song.videoId === item.videoId) contains = true;
            i++;
        }
        return contains;
    }

    async playMegAkarokHalni(message){
        if(this.queue.length > 0) this.clear();
        if(this.voiceConnection.dispatcher) this.songFinish();
        this.createSong(message, 'D:/Harukawa_bot/megakarokhalni2.mp3');
        await this.voiceConnection.play('D:/Harukawa_bot/megakarokhalni2.mp3');
        this.voiceConnection.dispatcher.on("finish",async()=>{
            await this.songFinish();
        });
    }
}
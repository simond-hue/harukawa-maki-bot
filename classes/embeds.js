const Discord = require('discord.js');
const index = require("../index");

const pfplink = "https://cdn.discordapp.com/avatars/720426327869751298/120b85dcf154207add13198fdd2b8dbb.png";
const botname = "Harukawa Maki";

module.exports.ErrorEmbed = class ErrorEmbed extends Discord.MessageEmbed{
    constructor(message){
        super();
        this.setColor('#de374e');
        this.setTitle(message);
    }
}

module.exports.SongEmbed = class SongEmbed extends Discord.MessageEmbed{
    constructor(song){
        super();
        this.setColor("#de374e");
        this.setTitle("Jelenlegi zeneszám")
        this.setURL(song.link)
        this.setDescription(song.title)
        this.setFooter(
            `Kérte: ${song.requestedBy}`,
            song.requestedByPFP
        )
        this.setThumbnail(song.thumbnail)
        this.setAuthor(
            botname,
            pfplink
        )
    }
}

module.exports.RequestedSongEmbed = class RequestedSongEmbed extends Discord.MessageEmbed{
    constructor(song){
        super();
        this.setColor("#de374e");
        this.setTitle("Kért zeneszám")
        this.setURL(song.link)
        this.setDescription(song.title)
        this.setFooter(
            `Kérte: ${song.requestedBy}`,
            song.requestedByPFP
        )
        this.setThumbnail(song.thumbnail)
        this.setAuthor(
            botname,
            pfplink
        )
    }
}

module.exports.NowPlayingEmbed = class NowPlayingEmbed extends Discord.MessageEmbed{
    constructor(song, currentTime){
        super();
        this.setColor("#de374e");
        this.setTitle("Jelenlegi zeneszám")
        this.setURL(song.link)
        this.setDescription(song.title)
        this.setFooter(
            `Kérte: ${song.requestedBy}`,
            song.requestedByPFP
        )
        this.setThumbnail(song.thumbnail)
        this.setAuthor(
            botname,
            pfplink
        )
        if(!song.isLive){
            this.addField(this.createDisplay(currentTime,song.length),this.normalize(currentTime)+"/"+this.normalize(song.length));
        }
    }

    createDisplay(current,max){
        var display = "";
        for(var i = 0; i < 50; i++){
            display += "-";
        }
        var index = current/max*100/2;
        display = display.substr(0,index) + "⬤" + display.substr(index+1,display.length);
        return display;
    }

    normalize(seconds){
        var hour = Math.floor(seconds/3600);
        seconds -= hour*3600;
        var minutes = Math.floor(seconds/60);
        seconds -= minutes*60;
        hour < 10 ?     hour = "0" + hour : hour = hour;
        minutes < 10 ?  minutes = "0" + minutes : minutes = minutes;
        seconds < 10 ?  seconds = "0" + seconds : seconds = seconds;
        var normalized = minutes + ":" + seconds;
        if(hour !== "00") normalized = hour + ":" + normalized;
        return normalized;
    }
}

module.exports.QueueEmbed = class QueueEmbed extends Discord.MessageEmbed{
    constructor(servername, length, page){
        super();
        this.setColor('#de374e');
        this.setTitle(`Lejátszási lista a(z) ${servername} szerveren`);
        this.setFooter(`${length} szám - ${page+1}/${Math.floor(length/10)+1}` );
        this.setAuthor(
            botname,
            pfplink
        );
    }

    addTitle(){
        this.addField("\u200b","**__Következő számok__**")
    }

    addSong(nth,song){
        this.addField("\u200b","\`"+nth+"\`" + ". " + `[${song.title}](${song.link})` + " " + "\`| " + this.normalize(song.length) + ` Kérte: ${song.requestedBy}\``);
    }

    nowPlayingDisplay(nth,song){
        this.addField("\u200b","**__Jelenlegi szám__**");
        this.addField("\u200b","\`" +nth+"\`" + ". " + `[${song.title}](${song.link})` + " " + "\`| " + this.normalize(song.length) + ` Kérte: ${song.requestedBy}\n\``);
    }

    normalize(seconds){
        var hour = Math.floor(seconds/3600);
        seconds -= hour*3600;
        var minutes = Math.floor(seconds/60);
        seconds -= minutes*60;
        hour < 10 ?     hour = "0" + hour : hour = hour;
        minutes < 10 ?  minutes = "0" + minutes : minutes = minutes;
        seconds < 10 ?  seconds = "0" + seconds : seconds = seconds;
        var normalized = minutes + ":" + seconds;
        if(hour !== "00") normalized = hour + ":" + normalized;
        return normalized;
    }
}

module.exports.HelpEmbed = class HelpEmbed extends Discord.MessageEmbed{
    constructor(){
        super();
        this.setColor('#de374e');
        this.addField("A bot dokumentációja","A bot dokumentációja [itt](https://simond-hue.github.io/haruakawa-bot-documentation/) érhető el (WIP)");
        this.setThumbnail(pfplink)
        this.setAuthor(
            botname,
            pfplink
        )
    }
}

module.exports.ColorEmbed = class ColorEmbed extends Discord.MessageEmbed{
    constructor(color){
        super();
        this.setColor('#de374e');
        this.setTitle('Szín állítás')
        this.setDescription('A jobb oldali színt választottad.\nKattints a megfelelő emoji-ra!')
        color = color.replace('#','');
        this.setThumbnail(`http://singlecolorimage.com/get/${color}/150x150`);
        this.setAuthor(
            botname,
            pfplink
        )
    }
}

const Discord = require("discord.js");
const botconfig = require("./botconfig.json");
const fs = require("fs");
const request = require("request");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.type = new Discord.Collection();

var servers = [];
var messageServers = [];


fs.readdir("./commands", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.endsWith(".js"));
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded`);
        bot.commands.set(props.help.name, props);
    });
    console.log("Every command is loaded!");
});

bot.on("message", async message => {
    if (message.author.bot) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let prefix = botconfig.prefix;
    switch (message.content.toLowerCase()) {
        case 'fasz':
            await message.channel.send('faszfasz.html');
            break;
        case 'nigger':
            await message.channel.send('nigger');
            break;
        case 'o7':
            await message.channel.send('o7');
            break;
        case '\\o':
            await message.channel.send('o/');
            break;
        case 'o/':
            await message.channel.send('\\o');
            break;
        case 'durgum':
            await message.channel.send('Elegem van belotetek bazdmeg, menjel mar innen te hervadas toroltem a fiokom miattatok egyebkent utol ertelek volna siman te nyomoronc na menje verjed magad az osun 30evesen toljad a Haitai palyat mert csak neked az jut, engem ne edesezz mert megkereslek azt megbaszlak  szoval okosan dumalj nekem na menje verjed magad a tarsaiddal egyutt hajra a top1-hez ! ;)');
            break;
        case 'hete':
            await message.channel.send('Másszál föl! Uram.. uram... Kérdezhetek valamit magától valamit? Először mássz föl, de amúgy igen. Akkor most kérdezhetek? Akkor mondjad... HE TE BRÉTÚRÓ A KURVA ANYÁDAT! Arcade... Arcade a srác neve. A KURVA ANYÁDAT BRÉTÚRÓ! aha... GRAFIKUST KIFIZETTED MÁR, TE BUZI? igen..? HOGY BASSZAK RÁ ARRA A KUGLI KOPASZ GECI FEJEDRE! Fhuu... de értelmes gyermek vagy. MOSÓGÉPET KIFIZETTED TE FASSZOPÓ? Így van és a lakást se, nyugalom. Anyád biztos büszke rád! ENGEM.. TÉGED CSALT MEG VELEM. Igen?! De jó... örülök neki! ÚGY SZOPOTT HALLOD... Aha... NAGYON DURVA! Mhm... oké. TE KOPASZ KÖCSÖG! Igen? Köcsög vagyok? A KURVA ANYÁDAT! Ezért az anyámat?! BÜDÖS VAGY... Te figyelj, nem akarok köcsög lenni, azt mondod, hogy szarabb voltál mint én? Vagy miért vagy rám ideges? NEM HALLAK VEDD KI A FASZT A SZÁDBÓL, TE KOPASZ GECI! Jó... Oké, oké... HOGY VILÁGÍT A FEJED A LIVEBA!')
    }
    if(message.content.toLowerCase().includes("buzi vagyok") || message.content.toLowerCase().includes("buzivagyok"))
        await message.channel.send(':microphone:sawarasenai:smiling_face_with_3_hearts:kimi:smile_cat:wa:chains:shoujo:ghost:na:nail_care:no?:sparkles:böKù:cherry_blossom:Wâ:fairy:ÿARiçHiñ:prince:BįCChī:pouting_cat:ńO:weary:oSû:person_rowing_boat:Dà:tada:YO:sweat_drops: :microphone:sawarasenai:smiling_face_with_3_hearts:kimi:smile_cat:wa:chains:shoujo:ghost:na:nail_care:no?:sparkles:böKù:cherry_blossom:Wâ:fairy:ÿARiçHiñ:prince:BįCChī:pouting_cat:ńO:weary:oSû:person_rowing_boat:Dà:tada:YO:sweat_drops: :microphone:sawarasenai:smiling_face_with_3_hearts:kimi:smile_cat:wa:chains:shoujo:ghost:na:nail_care:no?:sparkles:böKù:cherry_blossom:Wâ:fairy:ÿARiçHiñ:prince:BįCChī:pouting_cat:ńO:weary:oSû:person_rowing_boat:Dà:tada:YO:sweat_drops: :microphone:sawarasenai:smiling_face_with_3_hearts:kimi:smile_cat:wa:chains:shoujo:ghost:na:nail_care:no?:sparkles:böKù:cherry_blossom:Wâ:fairy:ÿARiçHiñ:prince:BįCChī:pouting_cat:ńO:weary:oSû:person_rowing_boat:Dà:tada:YO:sweat_drops: :microphone:sawarasenai:smiling_face_with_3_hearts:kimi:smile_cat:wa:chains:shoujo:ghost:na:nail_care:no?:sparkles:böKù:cherry_blossom:Wâ:fairy:ÿARiçHiñ:prince:BįCChī:pouting_cat:ńO:weary:oSû:person_rowing_boat:Dà:tada:YO:sweat_drops: :microphone:sawarasenai:smiling_face_with_3_hearts:kimi:smile_cat:wa:chains:shoujo:ghost:na:nail_care:no?:sparkles:böKù:cherry_blossom:Wâ:fairy:ÿARiçHiñ:prince:BįCChī:pouting_cat:ńO:weary:oSû:person_rowing_boat:Dà:tada:YO:sweat_drops:');

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (botconfig.prefix === cmd.slice(0, prefix.length)) {
        log(message);
        try{
            if(!messageServers[message.guild.id]) messageServers[message.guild.id] = { canCallCommand: true }
            if(messageServers[message.guild.id].canCallCommand){
                if (commandfile && commandfile.type !== 'auto'){
                    messageServers[message.guild.id].canCallCommand = false;
                    setTimeout(() => {
                        messageServers[message.guild.id].canCallCommand = true;
                    }, 3000);
                    commandfile.run(bot, message, args);
                }
                else{
                    bot.commands.forEach(element => {
                        if(element.help.alias){
                            var i = 0;
                            while(i<element.help.alias.length){
                                if(element.help.alias[i] === cmd.slice(prefix.length) && messageServers[message.guild.id].canCallCommand){
                                    element.run(bot,message,args);
                                    messageServers[message.guild.id].canCallCommand = false;
                                    setTimeout(() => {
                                        messageServers[message.guild.id].canCallCommand = true;
                                    }, 3000);
                                    break;
                                }
                                i++;
                            }
                        }
                    });
                }
            }
            
        }
        catch(err){
            if(err){
                console.log(err);
            }
        }
    }
});

bot.on("ready", async() => {
    console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);
    bot.user.setPresence({
        activity: {
            name: "faszfasz.html", 
            type: "WATCHING"
        },
        status: "dnd"
    });
    bot.guilds.cache.forEach(g =>{
        var object = { canCallCommand: true }
        messageServers[g.id] = object;
    })
});

bot.on("error", error => console.log("\x1b[31m%s\x1b[0m",error));
/*bot.on("debug", info => {
    if(info.match(/\[(\S*.?)\]/g))
        console.log("\x1b[32m%s\x1b[0m",info);
    else
        console.log("\x1b[33m%s\x1b[0m",info);
});*/

function log(message){
    now = new Date();
    string = fs.readFileSync("./log.log");
    string += "[" + now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate()+ " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "]";
    string += " " + message.author.username + ": " + message.content + "\n";
    fs.writeFileSync("./log.log", string);
}

bot.login(botconfig.token);

exports.servers = servers;
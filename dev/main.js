const Discord = require('discord.js');
var cmdhandler = require('./util/cmdhandler');
var scorehandler = require('./util/scorehandler');
var discordInfo = require('../../BotAuth.js')
const bot = new Discord.Client();

// Variables for Server Specific Text Channels
bot.on('ready', () => {
    console.log('CFPugs - ELO Now Active');
});

bot.on('message', (message) =>{

    if (message.attachments) {
        message.attachments.forEach(attachment => {
            console.log("File Uploaded: " + attachment.url);
            if(attachment.url.endsWith(".bmp")){
                var Command = message.content.substring(1);
                var Parameters = Command.split(" ");
    
                if(Parameters[0] == "match"){
                    scorehandler.completeMatch(cmdhandler, message, attachment,Parameters[1]);
                    message.reply("Loading Match Results...");
                }
            }
        });

    }else if(message.content.charAt(0) == "="){
        var Command = message.content.substring(1);
        var Parameters = Command.split(" ");
        console.log(message.author.username + " entered command: =" + Command);

        cmdhandler.execCommand(Parameters, message);
    }
});

bot.on("presenceUpdate", (oldMember, newMember) => {
    if(oldMember.presence.status !== newMember.presence.status){
        if(newMember.presence.status == "offline"){
            cmdhandler.isOfflineinQueue(newMember);
        }
        if(newMember.presence.status == "idle"){
            cmdhandler.isAwayinQueue(newMember);
        }
    }
});

// On exit Close Connections with MySQL and Discord
process.on('exit', (code) => {
    bot.disconnect;
    cmdhandler.sqlDisconnect();
});

bot.login(discordInfo.getAuth());






  

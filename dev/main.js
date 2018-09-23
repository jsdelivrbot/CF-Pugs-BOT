const Discord = require('discord.js');
var cmdhandler = require('./util/cmdhandler');

const bot = new Discord.Client();

// Variables for Server Specific Text Channels


bot.on('message', (message) =>{

    if(message.content.charAt(0) == "="){
        var Command = message.content.substring(1);
        var Parameters = Command.split(" ");
        console.log(message.author.username + " entered command: =" + Command);

        cmdhandler.execCommand(Parameters, message);

    }

});




// On exit Close Connections with MySQL and Discord
process.on('exit', (code) => {
    message.reply("Pce");
    bot.disconnect;
    con.end(function(err) {

    });
});


bot.login("NDg4MTYzODA1MTMwNTIyNjU0.DnYQVg.kDfA9Sa-g4U5p_xxjRA0G9WP-UA");






  

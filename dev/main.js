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



    // // For Users Who want to Register
    // if(message.channel.name == registerChannel && message.content == "=register"){
    //     message.reply("Registered User " + message.author.username);
    //     message.guild.members.get(message.author.id).setNickname("[100] "+message.author.username);
    //     var sql = "INSERT INTO Player (`pID`, `username`) VALUES ("+message.author.id+", \""+message.author.username+"\")";
    //     con.query(sql, function (err, result) {
    //       if (err) throw err;
    //       console.log("Registered User "+ message.author.username);
    //     });
    // }

    // // For Players Joining the Queue
    // if(message.channel.name == lobbyChannel && message.content == "=j"){
    //     // See if current user is already in the queue
    //     if(PUGQueue.length < 10){
    //         if(PUGQueue.indexOf(message.author.id) == -1){
    //             // If not Check if user is registered then Add Player to queue
    //             var isRegistered;
    //             con.connect(function(err) {
    //                 if (err) throw err;
    //                 con.query("SELECT username FROM Player WHERE pID = ?", [message.author.id], function (err, result, fields) {
    //                     if(result[0] != undefined){
    //                         PUGQueue.push(message.author.id);
    //                         message.reply("Added to the Queue ["+PUGQueue.length+"/10]");
                            
    //                         if(PUGQueue.length == 10){
    //                             CreateMatch();
    //                         }
    //                     }else{
    //                         message.reply("You Must Register Before you can Join the Queue. !Register \"ign\" in #Register-here");
    //                     }
    //                 });
    //             });
    //             //TODO: Check if queue is full. If so, Make a match
    //         }else{
    //             message.reply("You are already in the Queue ["+PUGQueue.length+"/10]");
    //         }
    //     }
    // }
   
    // // For Players to Check the current Queue
    // if(message.channel.name == lobbyChannel && message.content == "=q"){
    //     var tempMessage = "__Current Queue ["+PUGQueue.length+"/10]__";
    //     for(var x = 0; x < PUGQueue.length; x++){
    //         tempMessage += "\n"+(x+1)+". <@"+PUGQueue[x]+">";
    //     }
    
    //     message.reply({embed: {
    //         color: 3447003,
    //         description: tempMessage
    //     }});
    // }
    
    // // For When a Moderator wants to disconnect the bot
    // if(message.content == "=leave"){
    //     message.reply("Pce");
    //     process.exit(1);
    // }


});




// On exit Close Connections with MySQL and Discord
process.on('exit', (code) => {
    message.reply("Pce");
    bot.disconnect;
    con.end(function(err) {

    });
});


bot.login("NDg4MTYzODA1MTMwNTIyNjU0.DnYQVg.kDfA9Sa-g4U5p_xxjRA0G9WP-UA");






  

const Discord = require('discord.js');
var mysql = require('mysql');
var decode = require('./util/cmddecoder');
const bot = new Discord.Client();

// Variables for Server Specific Text Channels
const registerChannel = "test";
const lobbyChannel = "test";


var PUGQueue = new Array();


bot.on('message', (message) =>{


    if(message.content.charAt(0) == "="){
        var Command = message.content.substring(1);
        var Parameters = Command.split(" ");

        console.log(message.author.username + " Entered Command: " + Command);

        decode.execCommand(Parameters);
    }



    // For Users Who want to Register
    if(message.channel.name == registerChannel && message.content == "=register"){
        message.reply("Registered User " + message.author.username);
        message.guild.members.get(message.author.id).setNickname("[100] "+message.author.username);
        var sql = "INSERT INTO Player (`pID`, `username`) VALUES ("+message.author.id+", \""+message.author.username+"\")";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Registered User "+ message.author.username);
        });
    }

    // For Players Joining the Queue
    if(message.channel.name == lobbyChannel && message.content == "=j"){
        // See if current user is already in the queue
        if(PUGQueue.length < 10){
            if(PUGQueue.indexOf(message.author.id) == -1){
                // If not Check if user is registered then Add Player to queue
                var isRegistered;
                con.connect(function(err) {
                    if (err) throw err;
                    con.query("SELECT username FROM Player WHERE pID = ?", [message.author.id], function (err, result, fields) {
                        if(result[0] != undefined){
                            PUGQueue.push(message.author.id);
                            message.reply("Added to the Queue ["+PUGQueue.length+"/10]");
                            
                            if(PUGQueue.length == 10){
                                CreateMatch();
                            }
                        }else{
                            message.reply("You Must Register Before you can Join the Queue. !Register \"ign\" in #Register-here");
                        }
                    });
                });
                //TODO: Check if queue is full. If so, Make a match
            }else{
                message.reply("You are already in the Queue ["+PUGQueue.length+"/10]");
            }
        }
    }
   
    // For Players to Check the current Queue
    if(message.channel.name == lobbyChannel && message.content == "=q"){
        var tempMessage = "__Current Queue ["+PUGQueue.length+"/10]__";
        for(var x = 0; x < PUGQueue.length; x++){
            tempMessage += "\n"+(x+1)+". <@"+PUGQueue[x]+">";
        }
    
        message.reply({embed: {
            color: 3447003,
            description: tempMessage
        }});
    }
    
    // For When a Moderator wants to disconnect the bot
    if(message.content == "=leave"){
        message.reply("Pce");
        process.exit(1);
    }


});

var con = mysql.createConnection({
  host: "192.168.1.64",
  user: "jeff",
  password: "notpassword",
  database: "CFPugs"
});


// On exit Close Connections with MySQL and Discord
process.on('exit', (code) => {
    message.reply("Pce");
    bot.disconnect;
    con.end(function(err) {

    });
});

function CreateMatch(){
    // Already within a DB Connection so no need to reconnect
    
    var ELOs = new Array();
    // Collect all the Elo's from current players in the Queue
    for(var x = 0; x < 10; x++){
        con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[x]], function (err, result, fields) {
            ELOs.push(result[0].elo);
        });
    }
    // You now have the Elo and username of each player in the queue. Create the teams and the match based on this


    var cycles = 0;
    var temp;
    var x = 0;

    // Sorting algorithim Worst Case O(n^2) Average Case O((n^2)/2) Best Case 0(n)
    while(cycles < (ELOs.length-1)){
        if(ELOs[x] <= ELOs[x+1]){
            cycles++;
        }else{
            temp = ELOs[x];
            ELOs[x] = ELOs[x+1];
            ELOs[x+1] = temp;

            // Reording the Player Id's so they match the sorted Elos
            temp = PUGQueue[x];
            PUGQueue[x] = PUGQueue[x+1];
            PUGQueue[x+1] = temp;
        }
    
        x++;
    
        if(x == (ELOs.length-1) && cycles != (ELOs.length -1)){
            x = 0;
            cycles = 0;
        }
    }

    // Now, having the Elo's sorted we must approach the Players Team Assignment based on Elo
    // After Assigning sides. Complete Fairness Step (Switching Pair with Highest Difference in Elo)

    // Finding the Index of the Pair with the highest difference
    var highestDiffIdx;
    var max = -1;
    for(var x = 0; x < 10; x+=2){
        if((ELOs[x+1] - ELOs[x]) > max){
            highestDiffIdx = x;
        }
    }

    // Swaping pairs
    temp = ELOs[highestDiffIdx];
    ELOs[highestDiffIdx] = ELOs[highestDiffIdx + 1];
    ELOs[highestDiffIdx + 1] = temp;

    temp = PUGQueue[highestDiffIdx];
    PUGQueue[highestDiffIdx] = PUGQueue[highestDiffIdx + 1];
    PUGQueue[highestDiffIdx + 1] = temp;

    // Team 1 is Idx 0-4 of PUGQueue
    // Team 2 is Idx 5-9 of PUGQueue
    
    // Inserting into Database

    // Createing teams **Might have to put everything inside eachother...
    var team1, team2, matchid;
    con.query("INSERT INTO Team WHERE VALUES();", function (err, result, fields) {
        team1 = result.insertId;
    });
    con.query("INSERT INTO Team WHERE VALUES();", function (err, result, fields) {
        team2 = result.insertId;
    });

    for(var x = 0; x < 5; x++){
        con.query("INSERT INTO Plays WHERE VALUES(?, ?);", [PUGQueue[x],team1], function (err, result, fields) {});
    }
    for(var x = 5; x < 10; x++){
        con.query("INSERT INTO Plays WHERE VALUES(?, ?);", [PUGQueue[x],team2], function (err, result, fields) {});
    }
    // GRAB A RANDOM MAP FROM POOL. OR VOTE FOR MAP
    con.query("INSERT INTO `Match`(map, team1, team2) WHERE VALUES(?, ?, ?);", ["BlackWidow", team1, team2], function (err, result, fields) {
        matchid = result.insertId;
        console.log(matchid);
    });
}

bot.login("NDg4MTYzODA1MTMwNTIyNjU0.DnYQVg.kDfA9Sa-g4U5p_xxjRA0G9WP-UA");






  

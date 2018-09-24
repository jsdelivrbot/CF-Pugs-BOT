// Mysql Connection Detail
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "192.168.1.64",
    user: "jeff",
    password: "notpassword",
    database: "CFPugs"
});

const lobbyChannelID = "488205199446638593"; // NEED TO CHANGE WHEN Put into production

var PUGQueue = new Array();
var ELOs = new Array();
var isCaptainsMode = false; // Captain team picking is not available yet, this is just temporary

con.connect(function(err) {});
module.exports = {
    displayQueue: function(message){
             var tempMessage = "__**Current Queue ["+PUGQueue.length+"/10]**__";
        for(var x = 0; x < PUGQueue.length; x++){
            tempMessage += "\n"+(x+1)+". <@"+PUGQueue[x]+">";
        }
        replyMessage(message, tempMessage);
    },
    add: function(playerID, message){
        if(!PUGQueue.includes(playerID)){
            con.query("SELECT username FROM Player WHERE pID = ?", [playerID], function (err, result, fields) {
                if (err) throw err;

                if(result[0] != undefined){
                    PUGQueue.push(playerID);
                    replyMessage(message, "**Added to the Queue ["+PUGQueue.length+"/10]**");
                    console.log("Added to the Queue ["+PUGQueue.length+"/10]");
                    
                    if(PUGQueue.length == 10){
                        if(!isCaptainsMode)
                            loadELOs();

                    }
                }else{
                    replyMessage(message, "**You Must Register Before you can Join the Queue. !Register \"ign\" in #Register-here**");
                }
                
            });
        }else{
            replyMessage(message, "**You are already in the Queue ["+PUGQueue.length+"/10]**");
        }
    },
    remove: function(playerID, message){
        if(PUGQueue.includes(playerID)){
            PUGQueue.pop(playerID);
            replyMessage(message, "**You have been removed from the Queue ["+PUGQueue.length+"/10]**");
        }else{
            replyMessage(message, "**You're not currently in the Queue ["+PUGQueue.length+"/10]**");
        }
        
    },
    isOfflineinQueue: function(player){
        if(PUGQueue.includes(player.id)){
            PUGQueue.pop(player.id);
            player.client.channels.get(lobbyChannelID).send({
                embed:{
                    color: 3447003,
                    description: "<@"+player.id+"> **Went Offline. Removed From Queue ["+PUGQueue.length+"/10]**"
                }
            });
            console.log(player.user.tag + " Removed From Queue ["+PUGQueue.length+"/10] For going offline");
        }
    },
    isAwayinQueue: function(player){
        if(PUGQueue.includes(player.id)){
            PUGQueue.pop(player.id);
            player.client.channels.get(lobbyChannelID).send({
                embed:{
                    color: 3447003,
                    description: "<@"+player.id+"> **Went Idle. Removed From Queue ["+PUGQueue.length+"/10]**"
                }
            });
            player.user.send({
                embed:{
                    color: 3447003,
                    description: "You've Been Removed From the CF Pugs Queue because your discord status is now Idle"
                }
            });
            console.log(player.user.tag + " Removed From Queue ["+PUGQueue.length+"/10] For being Idle");
        }
    }

}

function loadELOs(){

    var elosLoaded = 0;

    var getELO = function(Player){
        con.query("SELECT elo FROM Player WHERE pID = ?;", [Player], function (err, result, fields) {
            ELOs.push(result[0].elo);

            elosLoaded++;

            if(elosLoaded == 10)
                CreateMatch();
        });
    };

    // Using a CallBack Method so that we can compute the results of the queries before we continue to the next step
    for(var x = 0; x < 10; x++)
        getELO(PUGQueue[x]);

}

function CreateMatch(){
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
    // After Assigning sides. Complete Fairness Step (Switching Pair with best Difference in Elo) ** WORK IN PROGRESS **
    // Team 1 is Idx 0-4 of PUGQueue
    // Team 2 is Idx 5-9 of PUGQueue
    console.log("Starting Team Assignment")
    var ELOTeam1 = 0;
    var ELOTeam2 = 0;
    var ElODiff;
    for(var x = 0; x < 10; x+=2){
        ELOTeam1 += ELOs[x];
    }
    for(var x = 1; x < 10; x+=2){
        ELOTeam2 += ELOs[x];
    }
    ELODiff = ELOTeam1 - ELOTeam2;

    // **CHANGE** Make it so if the ELO Difference is over 50 point difference. Get the pair with the closesed to half the difference and swap them
    // If team1's elo is over 50 points more than team2's elo; Perform Fairness Step
    console.log("Initial:");
    console.log(ELOs);
    console.log(ELODiff);
    fairnessStep(ELODiff);
    ELOTeam1 = 0;
    ELOTeam2 = 0;
    for(var x = 0; x < 10; x+=2){
        ELOTeam1 += ELOs[x];
    }
    for(var x = 1; x < 10; x+=2){
        ELOTeam2 += ELOs[x];
    }
    
    ELODiff = ELOTeam1 - ELOTeam2;
    console.log("Post Step 1:");
    console.log(ELOs);
    console.log(ELODiff);
    fairnessStep(ELODiff);
    ELOTeam1 = 0;
    ELOTeam2 = 0;
    for(var x = 0; x < 10; x+=2){
        ELOTeam1 += ELOs[x];
    }
    for(var x = 1; x < 10; x+=2){
        ELOTeam2 += ELOs[x];
    }
    
    ELODiff = ELOTeam1 - ELOTeam2;
    console.log("Post Step 2:");
    console.log(ELOs);
    console.log(ELODiff);

    // Inserting into Database

    // Createing teams **Might have to put everything inside eachother...
    var team1, team2, matchid;
    con.query("INSERT INTO Team VALUES();", function (err, result) {
        team1 = result.insertId;
        for(var x = 0; x < 10; x+=2){
            con.query("INSERT INTO Plays VALUES(?, ?);", [PUGQueue[x],team1], function (err, result) {});
        }

        con.query("INSERT INTO Team VALUES();", function (err, result) {
            team2 = result.insertId;
            for(var x = 1; x < 10; x+=2){
                con.query("INSERT INTO Plays VALUES(?, ?);", [PUGQueue[x],team2], function (err, result) {});
            }

            // GRAB A RANDOM MAP FROM POOL. OR VOTE FOR MAP
            con.query("INSERT INTO `Match`(map, team1, team2) VALUES(?, ?, ?);", ["BlackWidow", team1, team2], function (err, result) {
                matchid = result.insertId;
                console.log(matchid);
            });
        });
    });
}


function fairnessStep(ELODiff){
    if(ELODiff < -50){
        //ELODiff = Math.abs(ELODiff); // Make the Difference Positive

        // Finding the Index of the Pair with the best difference
        var perfectDiff = ELODiff / 2;
        var bestDiffIdx = 0;
        var min = Math.abs((ELOs[0] - ELOs[1]) - perfectDiff);
        
        // Needs Testing
        for(var x = 2; x < 10; x+=2){
            var tempDiff = Math.abs((ELOs[x] - ELOs[x+1]) - perfectDiff);
            if(tempDiff <= min){
                bestDiffIdx = x;
                min = tempDiff;
            }
        }
        // Swaping pairs
        temp = ELOs[bestDiffIdx];
        ELOs[bestDiffIdx] = ELOs[bestDiffIdx + 1];
        ELOs[bestDiffIdx + 1] = temp;

        temp = PUGQueue[bestDiffIdx];
        PUGQueue[bestDiffIdx] = PUGQueue[bestDiffIdx + 1];
        PUGQueue[bestDiffIdx + 1] = temp;
        console.log("Compelted Fairness Step");
    }else if(ELODiff > 50){
              //ELODiff = Math.abs(ELODiff); // Make the Difference Positive

        // Finding the Index of the Pair with the best difference
        var perfectDiff = ELODiff / 2;
        var bestDiffIdx = 0;
        var min = (ELOs[8] - ELOs[9]) - perfectDiff;
        
        // Needs Testing
        for(var x = 8; x >= 0; x-=2){
            console.log("Change: "+ ((ELOs[x] - ELOs[x + 1]) - perfectDiff));
            var tempDiff = (ELOs[x] - ELOs[x + 1]) - perfectDiff;
            if(tempDiff <= min){
                bestDiffIdx = x;
                min = tempDiff;
            }
        }
        console.log("Best Idx: " + bestDiffIdx);
        // Swaping pairs
        temp = ELOs[bestDiffIdx];
        ELOs[bestDiffIdx] = ELOs[bestDiffIdx + 1];
        ELOs[bestDiffIdx + 1] = temp;

        temp = PUGQueue[bestDiffIdx];
        PUGQueue[bestDiffIdx] = PUGQueue[bestDiffIdx + 1];
        PUGQueue[bestDiffIdx + 1] = temp;
        console.log("Compelted Fairness Step");
    }
}

function replyMessage(message, content){
    message.reply({embed: {
        color: 3447003,
        description: content
    }});
}
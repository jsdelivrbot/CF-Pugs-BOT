const Tesseract = require('../tesseract')
const path = require('path')
var Jimp = require('jimp');
var stringSimilarity = require('string-similarity');

var textPos = {
    'ScoreforBL':{
      'x': 650,'y': 61,'w': 55,'h': 16, 'id': 'ScoreBL', 'ActualValue': '10:6', 'idx': -1
    },
    'p1': {
      'name': {'x': 121,'y': 127,'w': 136,'h': 22, 'id': 'name', 'idx': 0},
      'kda': {'x': 292,'y': 127,'w': 74,'h': 22, 'id': 'kda', 'idx': 0},
      'mvp': {'x': 403,'y': 127,'w': 30,'h': 22, 'id': 'mvp', 'idx': 0}
    },
    'p2': {
      'name': {'x': 121,'y': 160,'w': 136,'h': 22, 'id': 'name', 'idx': 1},
      'kda': {'x': 292,'y': 160,'w': 74,'h': 22, 'id': 'kda', 'idx': 1},
      'mvp': {'x': 403,'y': 160,'w': 30,'h': 22, 'id': 'mvp', 'idx': 1}
    },
    'p3': {
      'name': {'x': 121,'y': 190,'w': 136,'h': 22, 'id': 'name', 'idx': 2},
      'kda': {'x': 292,'y': 190,'w': 74,'h': 22, 'id': 'kda', 'idx': 2},
      'mvp': {'x': 403,'y': 190,'w': 30,'h': 22, 'id': 'mvp', 'idx': 2}
    },
    'p4': {
      'name': {'x': 121,'y': 221,'w': 136,'h': 22, 'id': 'name', 'idx': 3},
      'kda': {'x': 292,'y': 221,'w': 74,'h': 22, 'id': 'kda', 'idx': 3},
      'mvp': {'x': 403,'y': 221,'w': 30,'h': 22, 'id': 'mvp', 'idx': 3}
    },
    'p5': {
      'name': {'x': 121,'y': 251,'w': 136,'h': 22, 'id': 'name', 'idx': 4},
      'kda': {'x': 292,'y': 251,'w': 74,'h': 22, 'id': 'kda', 'idx': 4},
      'mvp': {'x': 403,'y': 251,'w': 30,'h': 22, 'id': 'mvp', 'idx': 4}
    },
    'p6': {
      'name': {'x': 121,'y': 493,'w': 136,'h': 22, 'id': 'name', 'idx': 5},
      'kda': {'x': 292,'y': 493,'w': 74,'h': 22, 'id': 'kda', 'idx': 5},
      'mvp': {'x': 403,'y': 493,'w': 30,'h': 22, 'id': 'mvp', 'idx': 5}
    },
    'p7': {
      'name': {'x': 121,'y': 524,'w': 136,'h': 22, 'id': 'name', 'idx': 6},
      'kda': {'x': 292,'y': 524,'w': 74,'h': 22, 'id': 'kda', 'idx': 6},
      'mvp': {'x': 403,'y': 524,'w': 30,'h': 22, 'id': 'mvp', 'idx': 6}
    },
    'p8': {
      'name': {'x': 121,'y': 553,'w': 136,'h': 22, 'id': 'name', 'idx': 7},
      'kda': {'x': 292,'y': 553,'w': 74,'h': 22, 'id': 'kda', 'idx': 7},
      'mvp': {'x': 403,'y': 553,'w': 30,'h': 22, 'id': 'mvp', 'idx': 7}
    },
    'p9': {
      'name': {'x': 121,'y': 585,'w': 136,'h': 22, 'id': 'name', 'idx': 8},
      'kda': {'x': 292,'y': 585,'w': 74,'h': 22, 'id': 'kda', 'idx': 8},
      'mvp': {'x': 403,'y': 585,'w': 30,'h': 22, 'id': 'mvp', 'idx': 8}
    },
    'p10': {
      'name': {'x': 121,'y': 615,'w': 136,'h': 22, 'id': 'name', 'idx': 9},
      'kda': {'x': 292,'y': 615,'w': 74,'h': 22, 'id': 'kda', 'idx': 9},
      'mvp': {'x': 403,'y': 615,'w': 30,'h': 22, 'id': 'mvp', 'idx': 9}
    }
}
var pCount = 0;
var score;
var teamID1, teamID2;
var matchUsers;
var matchpIDs;
var Player = {
    'name': [],
    'kda': [],
    'mvp': [],
    'pid': []
};

module.exports = {
    completeMatch: function(cmdhandler, message, attachment, matchNumber){

        var con = cmdhandler.getDBConnection();

        var promise1 = new Promise(function(resolve, reject) {
          loadTeamIDs(con, message, matchNumber, reject);
          loadMatchDetails(con, cmdhandler, message, matchNumber, resolve);
        }).then((successMessage) => {
          console.log(successMessage);

          var promise2 = new Promise(function(resolve, reject) {
            readOffScoreBoard(attachment.url, message, textPos.ScoreforBL, resolve);

            for(var x = 0; x < 10; x++){
                readOffScoreBoard(attachment.url, message, textPos["p"+(x+1)].name, resolve);
                readOffScoreBoard(attachment.url, message, textPos["p"+(x+1)].kda, resolve);
                readOffScoreBoard(attachment.url, message, textPos["p"+(x+1)].mvp, resolve);
            }
          }).then((successMessage) => {
            console.log(successMessage);

            var rounds = score.split(":");
            var scoreBoard = "";
            var winningTeam;

            if(parseInt(rounds[0]) > parseInt(rounds[1])){
              winningTeam = 1;
            }else if(parseInt(rounds[0]) < parseInt(rounds[1])){
              winningTeam = 2;
            }else{
              winningTeam = 0;
            }

            scoreBoard += "**Match #" + matchNumber + " Results:**\n"
                + "*Team 1:*\n";

            for(var x = 0; x < 5; x++){
              // Comparing the read username from the scoreboard to the actuall usernames in the game. (Image Reading Isn't perfect)
              var username = stringSimilarity.findBestMatch(Player.name[x], matchUsers).bestMatch;
              if(username.rating >= 0.2){
                //processPlayerScores(con, username, Player, team1, );
                var stats = Player.kda[x].replace(/[^0-9/]/g, "");
                stats = stats.split("/");
                var mvp = Player.mvp[x].replace(/[^0-9/]/g, "");

                if(stats.length == 3){
                  scoreBoard += username.target + " K:"+ stats[0] + " D:"+stats[1]+" MVPs:" + mvp + "\n";
                  var pID = matchpIDs[matchUsers.indexOf(username.target)];
                  insertPlayerScores(con, message, pID, teamID1, parseInt(stats[0]), parseInt(stats[1]), parseInt(mvp));
                }else{
                  console.log("Player " + (x+1) + ": KDA Read Incorrectly. OCR Read:" + Player.kda[x]);
                  scoreBoard += "Player " + (x+1) + ": KDA Read Incorrectly. OCR Read:" + Player.kda[x] +"\n";
                }
              }else{
                console.log("Player " + (x+1) + ": Name Not Found. OCR Read: " + Player.name[x]);
                scoreBoard += "Player " + (x+1) + ": Name Not Found. OCR Read: " + Player.name[x] +"\n";
                scoreBoard += "*Please make sure you DON'T have a NameCard or a Username Colour equipped. It Fucks with the Image Recognition*\n";
              }
            }

            scoreBoard += "*Team 2:*\n";
            for(var x = 5; x < 10; x++){
              var username = stringSimilarity.findBestMatch(Player.name[x], matchUsers).bestMatch;
              if(username.rating >= 0.2){
                //processPlayerScores(con, username, Player, team1, );
                var stats = Player.kda[x].replace(/[^0-9/]/g, "");
                stats = stats.split("/");
                var mvp = Player.mvp[x].replace(/[^0-9/]/g, "");

                if(stats.length == 3){
                  scoreBoard += username.target + " K:"+ stats[0] + " D:"+stats[1]+" MVPs:" + mvp + "\n";
                  var pID = matchpIDs[matchUsers.indexOf(username.target)];
                  insertPlayerScores(con, message, pID, teamID2, parseInt(stats[0]), parseInt(stats[1]), parseInt(mvp));
                }else{
                  console.log("Player " + (x+1) + ": KDA Read Incorrectly. OCR Read:" + Player.kda[x]);
                  scoreBoard += "Player " + (x+1) + ": KDA Read Incorrectly. OCR Read:" + Player.kda[x] +"\n";
                }
              }else{
                console.log("Player " + (x+1) + ": Name Not Found. OCR Read: " + Player.name[x]);
                scoreBoard += "Player " + (x+1) + ": Name Not Found. OCR Read: " + Player.name[x] +"\n";
                scoreBoard += "*Please make sure you DON'T have a NameCard or a Username Colour equipped. It Fucks with the Image Recognition*\n";
              }
            }
            scoreBoard += "__**Team "+ winningTeam +" Won!**__\n";
           

            message.reply({embed: {
                color: 3447003,
                description: scoreBoard
            }});

          });
          console.log(promise2);
        }).catch((rejectMessage) =>{
          message.reply({embed: {
            color: 3447003,
            description: rejectMessage
        }});
        });
        console.log(promise1);
    }

}


function readOffScoreBoard(image, message, pos, resolve){
    Jimp.read(image, (err, img) => {
      if (err) throw err;
      //Player two Image
  
        img
        .crop(pos.x,pos.y,pos.w,pos.h) // .crop(121,155,315,25)
        .resize(pos.w * 2, pos.h * 2) // resize
        .quality(100); // set JPEG quality
  
        // Changes any pixels that unusual Colours to Black
        for(var x = 0; x < img.bitmap.width; x++){
          for(var y = 0; y < img.bitmap.height; y++){
            if(img.getPixelColor(x,y) <= (Jimp.rgbaToInt(63, 63, 190,255))){
              img.setPixelColor(0,x,y)
            }
          }
        }

        img.greyscale() // set greyscale
            .fade(.5)
            .posterize(5)
            .contrast(-.4);
    
        
        img.write('../../img/'+pos.idx+pos.id+'.jpg'); // save
          // Create tesseract in main.
      Tesseract.recognize('../../img/'+pos.idx+pos.id+'.jpg', {
        lang:  path.resolve(__dirname, '../tesseract/lang/eng')
        })
        .then(function(result){
            var finaltext = result.text.replace(/\s/g, "");
            console.log(pos.idx+pos.id + " Gives: "+finaltext);
            if(pos.idx == -1){
                score = finaltext;
            }else{
                switch(pos.id){
                    case 'name':
                        Player.name[pos.idx] = finaltext;
                    break;
                    case 'kda':
                        finaltext = finaltext.replace(/B/g, "8");
                        Player.kda[pos.idx] = finaltext;
                    break;
                    case 'mvp':
                        finaltext = finaltext.replace(/B/g, "8");
                        Player.mvp[pos.idx] = finaltext;
                }
            }


            pCount++;
            if(pCount == 31){
              pCount = 0;
              resolve("Sucessful Scoreboard Read!");
            }
      }).catch((error) => {
      console.log(error)
      });
    });
}
  
function loadTeamIDs(con, message, matchNumber, reject){
  con.query("SELECT team1, team2 FROM `Match` WHERE mID = ?;", [matchNumber], function (err, result, fields) {
    if (err) replyMessage(message, err + " <@135649260141019136>"); // This is Jordems's Discord ID. (Developer)

    if(result[0] == undefined){
      reject("Match Doesn't Exist");
    }else{
      teamID1 = result[0].team1;
      teamID2 = result[0].team2;
    }


    console.log("Loaded TeamIDs - Team1: "+ teamID1 + " Team2: "+ teamID2);
  });
}

function loadMatchDetails(con, cmdhandler, message, matchNumber, resolve){

   matchUsers = [];
   matchpIDs = [];
    con.query("SELECT DISTINCT username, p.pID FROM `Match` as m, Team as t, Plays as pl, Player as p WHERE m.mID = ? and (m.team1 = pl.teamNumber or m.team2 = pl.teamNumber)", [matchNumber], function (err, result, fields) {
        if (err) replyMessage(message, err + " <@135649260141019136>"); // This is Jordems's Discord ID. (Developer)

        if(result[0] != undefined){
          for(var x = 0; x < 10; x++){
              console.log("User loaded Locally: "+result[x].pID + " " + result[x].username);
              matchUsers.push(result[x].username);
              matchpIDs.push(result[x].pID);
          }
          resolve("Retrieved Players From Database");
        }
    });
}

function insertPlayerScores(con, message, pID, teamID, kills, deaths, mvps){
  con.query("UPDATE Plays SET kills = ?, deaths = ?, mvps = ? WHERE pID = ? and teamNumber = ?", [kills,deaths,mvps,pID,teamID], function (err, result, fields) {
    if (err) replyMessage(message, err + " <@135649260141019136>"); // This is Jordems's Discord ID. (Developer)
    console.log("Inserted Player with details - pID:"+pID+" teamID:"+ teamID+" K:"+ kills+" D:"+ deaths +" mvp:"+ mvps)
  });
}

function replyMessage(message, content){
    message.reply({embed: {
        color: 3447003,
        description: content
    }});
}
  
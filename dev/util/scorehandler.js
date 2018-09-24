const Tesseract = require('../tesseract')
const path = require('path')
var Jimp = require('jimp');

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
var Player = {
    'name': [],
    'kda': [],
    'mvp': []
};

module.exports = {
    completeMatch: function(cmdhandler, message, attachment, matchNumber){
        // TODO: Check if match exists in db
        // TODO: Check if player submiting match is a part of match

    

        var promise = new Promise(function(resolve, reject) {
            readOffScoreBoard(attachment.url, message, textPos.ScoreforBL, resolve);

            for(var x = 0; x < 10; x++){
                readOffScoreBoard(attachment.url, message, textPos["p"+(x+1)].name, resolve);
                readOffScoreBoard(attachment.url, message, textPos["p"+(x+1)].kda, resolve);
                readOffScoreBoard(attachment.url, message, textPos["p"+(x+1)].mvp, resolve);
            }
        });

        promise.then((successMessage) => {
            console.log(successMessage);
            console.log(Player);
            var rounds = score.split(":");

            var scoreBoard = "**Match #" + matchNumber + " Results:**\n"
                + "*Team 1:*\n";
            for(var x = 0; x < 5; x++){
                scoreBoard += Player.name[x] + " "+ Player.kda[x] + " " + Player.mvp[x] + "\n";
            }
            scoreBoard += "*Team 2:*\n";
            for(var x = 5; x < 10; x++){
                scoreBoard += Player.name[x] + " "+ Player.kda[x] + " " + Player.mvp[x] + "\n";
            }
            if(parseInt(rounds[0]) > parseInt(rounds[1])){
                scoreBoard += "__**Team 1 Won!**__";
            }else{
                scoreBoard += "__**Team 2 Won!**__";
            }
            message.reply({embed: {
                color: 3447003,
                description: scoreBoard
            }});
        });

        console.log(promise);
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
  
  
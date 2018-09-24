const Tesseract = require('../tesseract')
const path = require('path')
var Jimp = require('jimp');
 
/*
Things Learned From Testing:
  - Users must not have a custom name colour, or a namecard. As, it will completely reck the OCR
  - 8's sometimes showup as B's on the OCR. So we will have to deal with this in the kda section
  - /'s sometimes showup as 1's on the OCR.
  - 8's sometimes showup as 13's on the OCR.
  - When Calculating the Scores, Before Submiting it to the DB Confirm them with the users
    - Who ever Dissagrees with the score will have their kda / mvp eliminated from the game

*/


var textPos = {
  'ScoreforBL':{
    'x': 650,'y': 61,'w': 55,'h': 16, 'id': 'ScoreBL', 'ActualValue': '10:6'
  },
  'p1': {
    'name': {'x': 121,'y': 127,'w': 136,'h': 22, 'id': '1 playerName', 'ActualValue': 'Jordems'},
    'kda': {'x': 292,'y': 127,'w': 74,'h': 22, 'id': '1 playerKda', 'ActualValue': '26/10/5'},
    'mvp': {'x': 403,'y': 127,'w': 30,'h': 22, 'id': '1 playerMvp', 'ActualValue': '7'}
  },
  'p2': {
    'name': {'x': 121,'y': 160,'w': 136,'h': 22, 'id': '2 playerName', 'ActualValue': 'Yufail'},
    'kda': {'x': 292,'y': 160,'w': 74,'h': 22, 'id': '2 playerKda', 'ActualValue': '14/11/10'},
    'mvp': {'x': 403,'y': 160,'w': 30,'h': 22, 'id': '2 playerMvp', 'ActualValue': '8'}
  },
  'p3': {
    'name': {'x': 121,'y': 190,'w': 136,'h': 22, 'id': '3 playerName', 'ActualValue': 'Labi.'},
    'kda': {'x': 292,'y': 190,'w': 74,'h': 22, 'id': '3 playerKda', 'ActualValue': '7/11/5'},
    'mvp': {'x': 403,'y': 190,'w': 30,'h': 22, 'id': '3 playerMvp', 'ActualValue': '6'}
  },
  'p4': {
    'name': {'x': 121,'y': 221,'w': 136,'h': 22, 'id': '4 playerName', 'ActualValue': 'SmokeDawg'},
    'kda': {'x': 292,'y': 221,'w': 74,'h': 22, 'id': '4 playerKda', 'ActualValue': '6/4/3'},
    'mvp': {'x': 403,'y': 221,'w': 30,'h': 22, 'id': '4 playerMvp', 'ActualValue': '1'}
  },
  'p5': {
    'name': {'x': 121,'y': 251,'w': 136,'h': 22, 'id': '5 playerName', 'ActualValue': ''},
    'kda': {'x': 292,'y': 251,'w': 74,'h': 22, 'id': '5 playerKda', 'ActualValue': ''},
    'mvp': {'x': 403,'y': 251,'w': 30,'h': 22, 'id': '5 playerMvp', 'ActualValue': ''}
  },
  'p6': {
    'name': {'x': 121,'y': 493,'w': 136,'h': 22, 'id': '6 playerName', 'ActualValue': 'Truth'},
    'kda': {'x': 292,'y': 493,'w': 74,'h': 22, 'id': '6 playerKda', 'ActualValue': '15/12/5'},
    'mvp': {'x': 403,'y': 493,'w': 30,'h': 22, 'id': '6 playerMvp', 'ActualValue': '3'}
  },
  'p7': {
    'name': {'x': 121,'y': 524,'w': 136,'h': 22, 'id': '7 playerName', 'ActualValue': 'Aroma'},
    'kda': {'x': 292,'y': 524,'w': 74,'h': 22, 'id': '7 playerKda', 'ActualValue': '12/12/5'},
    'mvp': {'x': 403,'y': 524,'w': 30,'h': 22, 'id': '7 playerMvp', 'ActualValue': '4'}
  },
  'p8': {
    'name': {'x': 121,'y': 553,'w': 136,'h': 22, 'id': '8 playerName', 'ActualValue': 'Exo_Tommy'},
    'kda': {'x': 292,'y': 553,'w': 74,'h': 22, 'id': '8 playerKda', 'ActualValue': '12/15/5'},
    'mvp': {'x': 403,'y': 553,'w': 30,'h': 22, 'id': '8 playerMvp', 'ActualValue': '3'}
  },
  'p9': {
    'name': {'x': 121,'y': 585,'w': 136,'h': 22, 'id': '9 playerName', 'ActualValue': 'F4DE'},
    'kda': {'x': 292,'y': 585,'w': 74,'h': 22, 'id': '9 playerKda', 'ActualValue': '9/8/8'},
    'mvp': {'x': 403,'y': 585,'w': 30,'h': 22, 'id': '9 playerMvp', 'ActualValue': '5'}
  },
  'p10': {
    'name': {'x': 121,'y': 615,'w': 136,'h': 22, 'id': '10 playerName', 'ActualValue': 'SmakABaby'},
    'kda': {'x': 292,'y': 615,'w': 74,'h': 22, 'id': '10 playerKda', 'ActualValue': '6/10/7'},
    'mvp': {'x': 403,'y': 615,'w': 30,'h': 22, 'id': '10 playerMvp', 'ActualValue': '3'}
  }
}
/* UserName: Colour range
    RGB: 216, 216, 216
    RGB 178, 178, 176
*/

// open a file called "lenna.png"
var pCount = 0;
var promise1 = new Promise(function(resolve, reject) {
  
    readOffScoreBoard(textPos.ScoreforBL, resolve);

    for(var x = 0; x < 10; x++){
      readOffScoreBoard(textPos["p"+(x+1)].name, resolve);
      readOffScoreBoard(textPos["p"+(x+1)].kda, resolve);
      readOffScoreBoard(textPos["p"+(x+1)].mvp, resolve);
    }
});

promise1.then((successMessage) => {
  console.log(successMessage);
});

console.log(promise1);

function readOffScoreBoard(pos, resolve){
  Jimp.read('../../img/score.bmp', (err, img) => {
    if (err) throw err;
    //Player two Image

      img
      .crop(pos.x,pos.y,pos.w,pos.h) // .crop(121,155,315,25)
      .resize(pos.w * 2, pos.h * 2) // resize
      .quality(100); // set JPEG quality

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
      // .dither565();
      // .dither565()
      // // .normalize()
      // .color([
      //   { apply: 'desaturate', params: [100] },
      //   { apply: 'mix', params: ['#FFFFFF', 60] }
      //   // ,
      //   // { apply: 'lighten', params: [50] },
      //   // { apply: 'xor', params: ['#000000'] }
      // ]);
  
      
      img.write('../../img/'+pos.id+'.jpg'); // save
        // Create tesseract in main.
    Tesseract.recognize('../../img/'+pos.id+'.jpg', {
      lang:  path.resolve(__dirname, '../tesseract/lang/eng')
      })
      .then(function(result){
          console.log(pos.id + " Expects: "+pos.ActualValue+", Gives: "+result.text);
          pCount++;
          if(pCount == 31){
            resolve("Succeess");
          }
    }).catch((error) => {
    console.log(error)
    });
  });
}


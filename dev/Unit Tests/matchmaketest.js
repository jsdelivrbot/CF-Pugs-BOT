var mysql = require('mysql');

// var k = [1,2, 3,4, 5,6, 7, 8, 9, 10];
// var a = [10,9, 8,7, 6,5, 4, 3, 2, 1];

// var cycles = 0;
// var temp;
// var x = 0;
// var count = 0;

// while(cycles < (a.length-1)){
//     if(a[x] <= a[x+1]){
//         cycles++;
//     }else{
//         temp = a[x];
//         a[x] = a[x+1];
//         a[x+1] = temp;

//         temp = k[x];
//         k[x] = k[x+1];
//         k[x+1] = temp;

//         // cycles = 0;
//         // x = 0;
        
//     }
//     x++;
//     console.log(a);
    

//     if(x == (a.length-1) && cycles != (a.length -1)){
//         x = 0;
//         cycles = 0;
//     }
//     count++;
// }


// console.log(cycles);
// console.log(k);
// console.log(a);

// console.log(count);

// var Diff = new Array();
// for(var x = 0; x < 10; x+=2){
//     Diff.push(a[x+1] - a[x]);
// }

// console.log(Diff);


var PUGQueue = [8,1,9,3,4,5,7,6,2,10];
var ELOs = new Array();
var con = mysql.createConnection({
    host: "192.168.1.64",
    user: "jeff",
    password: "notpassword",
    database: "CFPugs"
  });

  con.connect(function(err) {
    if (err) throw err;
    CreateMatch();
  });

function CreateMatch(){
    // Already within a DB Connection so no need to reconnect
    
   
    // Collect all the Elo's from current players in the Queue
 
        con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[0]], function (err, result, fields) {
            ELOs.push(result[0].elo);
            con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[1]], function (err, result, fields) {
                ELOs.push(result[0].elo);
                con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[2]], function (err, result, fields) {
                    ELOs.push(result[0].elo);
                    con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[3]], function (err, result, fields) {
                        ELOs.push(result[0].elo);
                        con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[4]], function (err, result, fields) {
                            ELOs.push(result[0].elo);
                            con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[5]], function (err, result, fields) {
                                ELOs.push(result[0].elo);
                                con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[6]], function (err, result, fields) {
                                    ELOs.push(result[0].elo);
                                    con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[7]], function (err, result, fields) {
                                        ELOs.push(result[0].elo);
                                        con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[8]], function (err, result, fields) {
                                            ELOs.push(result[0].elo);
                                            con.query("SELECT elo FROM Player WHERE pID = ?;", [PUGQueue[8]], function (err, result, fields) {
                                                ELOs.push(result[0].elo);
                                                console.log("Starting MatchMaking");
                                                MatchMake();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    // You now have the Elo and username of each player in the queue. Create the teams and the match based on this
}

function MatchMake(){
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
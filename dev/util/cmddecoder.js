const registerChannel = "test";
const lobbyChannel = "test";

module.exports = {
    execCommand: function(Parameters){
        var args = Parameters.length - 1;
        console.log(cmdList);
    }
}

var cmdList = {
    'register' :{ // !register {@username}
        'args': 1,
        'textchannel': 'register',
        'sql' : 'INSERT INTO Player (pID, username) VALUES (?, ?);'
    },
    'q' :{
        'args': 0,
        'textchannel': 'lobby',
        'sql' : null
    },
    'j' :{
        'args': 0,
        'textchannel': 'lobby',
        'sql' : 'SELECT username FROM Player WHERE pID = ?'
    },
    'l' :{
        'args': 0,
        'textchannel': 'lobby',
        'sql' : null
    },    
    'leaderboard' :{
        'args': 0,
        'textchannel': 'lobby',
        'sql' : 'SELECT username, elo FROM Player ORDER BY elo DESC LIMIT 10'
    },
    'userstats' :{ // !userstats ?{@username}?
        'args': 1, 
        'textchannel': 'any',
        'sql' : '**NOTDONE**'
        /*
        Query should return:
        - LeaderBoard Number
        - Wins
        - Losses
        - Kills
        - Deaths
        - Mvp's
        - Elo
        - Best Game skills
        - Most common teamate (Some random shit, that can be different everytime someone uses command)
        */
    }
};

var admincmdList = {
    'modifygame' :{
        'args': 2,
        'textchannel': 'register',
        'sql' : 'INSERT INTO Player (pID, username) VALUES (?, ?);'
    }
};

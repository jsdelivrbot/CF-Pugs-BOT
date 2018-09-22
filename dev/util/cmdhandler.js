const registerChannel = "test";
const lobbyChannel = "test";



module.exports = {
    /* execCommand:
        Recieves an array of parameters entered from
        ex: [command, args...]
        
        //TODO: Implement isAdmin for admin commands
    */
    setupCommand: function(Parameters){
        var args = Parameters.length - 1;
        var cmd = cmdList[Parameters[0]];

        if(cmd != undefined)
            return cmd;
        else
            return null; 
    }
}


/*
    Command Layout
    'command':{
        'args': number of arguments 
         - '-1' means optional
        'textchannel': discord textchannel that the command works in
         - 'any' means any channel
        'sql': Request for data from the mysql server
         - 'null' is for when no request is required for this command 
    }
*/
var cmdList = {
    'register' :{ // !register {@username}
        'args': 1,
        'textchannel': 'register',
        'sqltype' : 'insert',
        'sql' : 'INSERT INTO Player (pID, username) VALUES (?, ?);'
    },
    'q' :{
        'args': 0,
        'textchannel': 'lobby',
        'sqltype' : 'none'
    },
    'j' :{
        'args': 0,
        'textchannel': 'lobby',
        'sqltype' : 'select',
        'sql' : 'SELECT username FROM Player WHERE pID = ?'
    },
    'l' :{
        'args': 0,
        'textchannel': 'lobby',
        'sqltype' : 'none'
    },    
    'leaderboard' :{
        'args': 0,
        'textchannel': 'any',
        'sqltype' : 'select',
        'sql' : 'SELECT username, elo FROM Player ORDER BY elo DESC LIMIT 10'
    },
    'userstats' :{ // !userstats ?{@username}?
        'args': -1,
        'textchannel': 'any',
        'sqltype' : 'select',
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

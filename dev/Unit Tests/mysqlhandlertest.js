//var result = mysql.select("SELECT * FROM Player",[]);
const registerChannel = "test";
const lobbyChannel = "test";
var cmdList = {
    'register' :{ // =register {@username}
        'args': 1,
        'textchannel': registerChannel,
        'sqltype' : 'insert',
        'sql' : 'INSERT INTO Player (pID, username) VALUES (?, ?);',
        'sqlargs': ['playerID', 'parameter1'],
        'layout' : '`=register \'CrossFire Username\'`',
        'onSuccess': 'RegisterUser'
    },
    'q' :{
        'args': 0,
        'textchannel': lobbyChannel,
        'layout' : '`=q`'
    },
    'j' :{
        'args': 0,
        'textchannel': lobbyChannel,
        'sqltype' : 'select',
        'sql' : 'SELECT username FROM Player WHERE pID = ?',
        'sqlargs' : ['playerID'],
        'layout' : '`=j`'
    },
    'l' :{
        'args': 0,
        'textchannel': lobbyChannel,
        'sqltype' : 'none',
        'layout' : '`=l`'
    },    
    'leaderboard' :{
        'args': 0,
        'textchannel': 'any',
        'sqltype' : 'select',
        'sql' : 'SELECT username, elo FROM Player ORDER BY elo DESC LIMIT 10',
        'layout' : '`=leaderboard`'
    },
    'userstats' :{ // =userstats ?{@username}?
        'args': -1,
        'textchannel': 'any',
        'sqltype' : 'select',
        'sql' : '**NOTDONE**',
        'layout' : '`=userstats or =userstats @username`'
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


console.log(cmdList.q);

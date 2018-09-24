var mysql = require('mysql');
var matchhandler = require('./matchhandler');

const registerChannel = "test";
const lobbyChannel = "test";
var con = mysql.createConnection({
    host: "192.168.1.64",
    user: "jeff",
    password: "notpassword",
    database: "CFPugs"
});
/*
    Command Layout
    'command':{
        'args': number of arguments 
         - '-1' means optional
        'textchannel': discord textchannel that the command works in
         - 'any' means any channel
        'sqltype': Type of sql statement
        'sql': Request for data from the mysql server
         - 'null' is for when no request is required for this command 
        'sqlargs': The required arguments for the sqlstatement 
         - Ex: User enters '=command arg1'
         - parameter1 = arg1
         - if parameter1 is optional then we will check if it is undefined
         - (ADD MORE DETAILS)
        'layout': the correct format of the command
        'onSuccess': is a function that will be exectued after the sql statement in onSuccess() function
        'func': if the command is more complicated than just one query. Use this. Points to specialCommand() function
    }


    Reason For making the cmdList:
        I want to create a framework that allows me to easily add more commands for the bot.
*/

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
        'layout' : '`=q`',
        'func': 'getQueue'
    },
    'j' :{
        'args': 0,
        'textchannel': lobbyChannel,
        'layout' : '`=j`',
        'func': 'joinQueue'
    },
    'l' :{
        'args': 0,
        'textchannel': lobbyChannel,
        'layout' : '`=l`',
        'func': 'leaveQueue'
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

var admincmdList = {
    'modifygame' :{
        'args': 2,
        'textchannel': 'any',
        'sql' : ''
    }
};

module.exports = {
    /* execCommand:
        Recieves an array of parameters on discord message
        ex: [=command args...]
        
        //TODO: Implement isAdmin for admin commands
    */
   execCommand: function(Parameters, message){
        var cmd = cmdList[Parameters[0]];
        if(cmd != undefined){
            processCommand(cmd, Parameters, message);
        }else{
            replyMessage(message,"Command \"=" + Parameters[0] + "\" Doesn't Exist");
        }
    },

    isOfflineinQueue: function(player){
        matchhandler.isOfflineinQueue(player);
    },
    isAwayinQueue: function(player){
        matchhandler.isAwayinQueue(player);
    },
    getMatchHandler: function(){
        return matchhandler;
    }
}

function processCommand(cmd, Parameters, message){

    // Number of arguments the User has Entered
    var args = Parameters.length - 1;

    if(inCorrectChannel(cmd, message.channel.name)){
        if(isCorrectFormat(cmd,args)){
            
            switch(cmd.sqltype){
                case 'select':
                    var sqlargs = getSQLargs(cmd, message, Parameters);
                    con.query(cmd.sql, sqlargs, function (err, result, fields) {
                        if (err) replyMessage(message, err + " <@135649260141019136>"); // This is Jordems's Discord ID. (Developer)
                        console.log("Registered User "+ message.author.username);
                        replyMessage(message, "**Registered Player: **"+cmd.layout);
                    });

                break;
                case 'insert':
                    var sqlargs = getSQLargs(cmd, message, Parameters);
                    con.query(cmd.sql, sqlargs, function (err, result, fields) {
                        if (err) replyMessage(message, err + " <@135649260141019136>"); // This is Jordems's Discord ID. (Developer)
                        
                        if(cmd.onSuccess != undefined){
                            onSuccess(cmd, message, Parameters);
                        }
                    });
                break;
                case 'update':
                
                break;

                default:
                    specialCommand(cmd, message, Parameters);
            }

        }else{
            replyMessage(message, "**Required Format: **"+cmd.layout);
        }
    }else{
        replyMessage(message, "**This command only works in `#"+cmd.textchannel+"`**");
    }

}

function getSQLargs(cmd, message, Parameters){
    var sqlargs = new Array();

    if(cmd.sqlargs != undefined){
        for(var x = 0; x < cmd.sqlargs.length; x++){
            sqlargs.push(translateSQLargs(cmd.sqlargs[x],message,Parameters));
        }
    }

    return sqlargs;
}

// Should never need more than 3 paramaters after the command
function translateSQLargs(sqlarg,message,Parameters){
    switch(sqlarg){
        case 'playerID':
            return message.author.id;
        case 'parameter1':
            return Parameters[1];
        case 'parameter2':
            return Parameters[2];
        case 'parameter3':
            return Parameters[3];
        default:
            return null;
    }
}

function onSuccess(cmd, message, Parameters){
    switch(cmd.onSuccess){
        case 'RegisterUser':
            console.log("Registered User "+ Parameters[1]);
            replyMessage(message, "**Registered Player: **`"+Parameters[1]+"`");
            message.guild.members.get(message.author.id).setNickname("[100] "+Parameters[1]);
        break;
        default:
            return null;
    }
}

function specialCommand(cmd, message, Parameters){
    switch(cmd.func){
        case 'getQueue':
            matchhandler.displayQueue(message);
            break;
        case 'joinQueue':
            matchhandler.add(message.author.id, message);
            break;
        case 'leaveQueue':
            matchhandler.remove(message.author.id, message);
        break;
    }
}

function replyMessage(message, content){
    message.reply({embed: {
        color: 3447003,
        description: content
    }});
}

// Logic Functions to Clean up the code a bit
function inCorrectChannel(cmd, channel){
    if(cmd.textchannel == 'any')
        return true;
    else if(channel == cmd.textchannel)
        return true;
    else
        return false;
}
function isCorrectFormat(cmd, args){
    if(cmd.args < 0)
        return true;
    else if(cmd.args == args)
        return true;
    else
        return false;
}


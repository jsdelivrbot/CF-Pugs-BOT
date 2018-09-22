var matchhandler = require('./../util/matchhandler');

var PUGQueue = [8,1,9,3,4,5,7,6,2,10];

for(var x = 0; x < 10; x++)
    matchhandler.add(PUGQueue[x]);
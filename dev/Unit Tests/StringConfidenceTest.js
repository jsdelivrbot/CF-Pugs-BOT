/*
    This functionality will be used to take the text data from imageprocessing and comparing it with database data.
    Considering text data from image processing is not perfect, some characters will be miss read. Therefore, we need a way
    to find what it was trying to read, by giving it a confidence value compared to the actual values.


    Ways to gain Confidence between string comparison
    In a Case that there is String A and String B

    A = "usernOme8"
    B = "usern0me13"

    - We compare the individual characters with eachother
    - Taking account of similar characters like 0 and O 

*/
var names = ["jeff", "dog", "jordems", "name15", "a3126"];

var stringSimilarity = require('string-similarity');

var similarity = stringSimilarity.findBestMatch('c0w16eff', names); 

console.log(similarity.bestMatch);
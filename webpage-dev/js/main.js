/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let networkViz;

let selectedTimeRange = [];


// load data using promises
let promises = [
    d3.json("data/actors2.json"),  // not projected -> you need to do it
    d3.csv("data/connections_backup.csv"),
    d3.csv("data/connected_films.csv")
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {

    // init table
    networkViz = new NetworkMap("network-map", dataArray[0], dataArray[1], dataArray[2]);
}


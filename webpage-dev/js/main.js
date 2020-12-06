/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let myBirthMap, myBrushVis,
    myNetworkViz,
    myWinnerChart, myNomineeChart, myNormalizedNomChart, myNormalizedWinnerChart;
let parseDate = d3.timeParse("%Y-%m-%d");
let formatDate = d3.timeFormat("%B %d, %Y");
let yearParse = d3.timeParse("%Y");
let selectedTimeRange = [];

let colorScheme = ["#be9d39", "#c1c1c8", "#242423", "#e7e9ea", "#ab9a69"];


// load data using promises
let promises = [
    d3.json("data/actors.json"),
    d3.csv("data/connected_films.csv"),
    d3.json("data/network_data.json"),
    d3.csv("data/awards.csv")
];

Promise.all(promises)
    .then(function (data) {
        prepData(data)
    })
    .catch(function (err) {
        console.log(err)
    });

// prepData
function prepData(dataArray) {

    // prep actor data
    for (let i = 0; i < dataArray[0].length; i++) {
        // turn birthday to date obj
        dataArray[0][i].birthday = parseDate(dataArray[0][i].birthday);
        // count number of films
        dataArray[0][i].numFilms = dataArray[0][i].films.split(";;").length;
        // calculate ratio of total number of connections to total number of films
        dataArray[0][i].ratio = dataArray[0][i].n_costarred_films / dataArray[0][i].numFilms;
    }

    // prep awards data
    for (let i = 0; i < dataArray[3].length; i++) {
        // parse time data
        dataArray[3][i].year = yearParse(dataArray[3][i].year);
        // tidy inconsistencies in the data
        if (dataArray[3][i].award === "ACTOR") {
            dataArray[3][i].award = "ACTOR IN A LEADING ROLE";
        } else if (dataArray[1][i].award === "ACTRESS") {
            dataArray[3][i].award = "ACTRESS IN A LEADING ROLE";
        }
        // parse bool
        dataArray[3][i].win = dataArray[3][i].win !== "False";
    }

    // initMainPage
    initMainPage(dataArray);
}

// initMainPage
function initMainPage(dataArray) {
    // init map
    myBirthMap = new BirthMap("birth-map", dataArray[0], [30.833531, 15.403666]);

    // init networkViz
    myNetworkViz = new NetworkMap('network-map-2010', dataArray[0], dataArray[1], dataArray[2]);

    // init brush
    myBrushVis = new BrushVis('brushDiv', dataArray[0]);

    // init barcharts
    myNomineeChart = new BarChart('nom-chart', dataArray[0], dataArray[3], true, true);
    myWinnerChart = new BarChart('winner-chart', dataArray[0], dataArray[3], false, true);

    // init normalized barcharts
    myNormalizedNomChart = new BarChart('normalized-nom-chart', dataArray[0], dataArray[3], true, false);
    myNormalizedWinnerChart = new BarChart('normalized-winner-chart', dataArray[0], dataArray[3], false, false);
}


// Variable for the visualization instance
let birthMap;

// d3.json(url).then(jsonData =>{
// 	console.log(jsonData);
// });

fetch('data/actors.json', function(d){
    console.log(d)
})
    .then(response => response.json())
    .then(data => { gettingStarted(data)});


// function that gets called once data has been fetched.
// We're handing over the fetched data to this function.
// From the data, we're creating the final data structure we need and create a new instance of the StationMap
function gettingStarted(data) {

    console.log(data)
    console.log(data.birthplace)
    console.log(data.coordinates)
    // create empty data structure

    displayData = data
    console.log(Object.keys(displayData.birthplace).length)
    // Prepare data by looping over stations and populating empty data structure
    for (let i = 0; i < displayData.length; i++){
        console.log("HELLO")
    //     displayData[i].la = +displayData[i].la;
    //     displayData[i].lo = +displayData[i].lo;
    }
    // Display number of actors in DOM
    $("#actor-count").text(Object.keys(displayData.coordinates).length);

    // Instantiate visualization object
    birthMap = new BirthMap("birth-map", displayData, [42.360082, -71.058880]);
}

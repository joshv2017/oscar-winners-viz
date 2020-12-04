/*
 *  BirthMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _displayData     -- Array with all actors data
 *  @param _mapCenter		-- Where to center map
 */

class BirthMap {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, displayData, mapCenter) {
		this.parentElement = parentElement;
		this.displayData = displayData;
		this.mapCenter = mapCenter;

		this.parseDate = d3.timeParse("%m/%d/%Y");

		this.initVis();
	}


	/*
	 *  Initialize station map
	 */
	initVis() {
		let vis = this;

		L.Icon.Default.imagePath = 'img/';

		// call map
		vis.map = L.map('birth-map').setView(vis.mapCenter, 1.5);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(vis.map);

		// init marker group for clearing later
		vis.markerGroup = L.layerGroup()

		vis.wrangleData();
	}
	/*
	 *  Data wrangling
	 */
	wrangleData() {
		let vis = this;

		// filter according to selectedTimeRange
		// init empty array
		let filteredData = [];

		// check for selectedTimeRange
		console.log(selectedTimeRange)

		// if there is a time range selected
		if (selectedTimeRange.length !== 0){
			// push rows within the time range to filteredData
			vis.displayData.forEach( row => {
				if (selectedTimeRange[0].getTime() <= row.birthday && row.birthday <= selectedTimeRange[1].getTime() ){
					filteredData.push(row);
				}
			});
			// no time range selected
		} else {
			filteredData = vis.displayData;
		}

		// check dataset
		//console.log(filteredData);

		vis.actorsByBirthday = filteredData

		// update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		// clear old markers
		vis.markerGroup.clearLayers();

		// dynamic domains with selected attributes and years for x and y axes
		let yearInitial = d3.select('#start-year').property('value');
		let yearFinal = d3.select('#end-year').property('value');

		// filter actorsByBirthday based on selected time range
		let yearChosen = vis.actorsByBirthday.filter((val, _) => {
			return ((val.birthday) >= yearParse(yearInitial)) && ((val.birthday) <= yearParse(yearFinal))
		});

		// place markers and tooltip
		for (let i = 0; i < (yearChosen).length; i++) {
			// get current actor
			let currentActor = getCurrentActor(yearChosen[i].name, vis.actorsByBirthday);

			// add markers to markerGroup
			vis.marker = L.marker([(yearChosen[i].coordinates[0]), (yearChosen[i].coordinates[1])])
				.bindPopup(createActorTooltip(currentActor))
				.addTo(vis.markerGroup)
		}

		// add marker group to map
		vis.markerGroup.addTo(vis.map)
	}

}

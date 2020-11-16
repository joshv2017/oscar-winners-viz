
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class BirthMap {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, displayData, mapCenter) {
		this.parentElement = parentElement;
		this.displayData = displayData;
		this.mapCenter = mapCenter;

		this.initVis();
	}


	/*
	 *  Initialize station map
	 */
	initVis() {
		let vis = this;

		L.Icon.Default.imagePath = 'img/';

		vis.map = L.map('birth-map').setView([40.551341, -96.509443], .75);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(vis.map);

		vis.popupContent = "<strong>Maxwell Dworkin</strong><br/>";
		vis.popupContent += "Cambridge, MA";

		vis.marker = L.marker([42.378774, -71.117303])
			.bindPopup(vis.popupContent)
			.addTo(vis.map);


		vis.wrangleData();

}
	/*
	 *  Data wrangling
	 */
	wrangleData() {
		let vis = this;

		// No data wrangling/filtering needed

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;
		for (let i = 0; i < Object.keys(displayData.coordinates).length; i++) {

			vis.popupContent = "<strong>" + (vis.displayData.name[i]) + "</strong><br/>";
			vis.popupContent += "Birthplace: " + (vis.displayData.birthplace[i]) + "<br><br>";
			vis.popupContent += "Birthday: " + (vis.displayData.birthday[i]) + "<br><br>";

			vis.marker = L.marker([(vis.displayData.coordinates[i])[0], (vis.displayData.coordinates[i])[1]])
				.bindPopup(vis.popupContent)
				.addTo(vis.map);

		}

	}}

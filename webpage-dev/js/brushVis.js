/*
 *  BrushVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _displayData     -- Array with all actors data
 */

class BrushVis {

    /*
     *  Constructor method
     */
    constructor(parentElement, actorData) {
        this.parentElement = parentElement;
        this.displayData = actorData;
        this.parseDate = d3.timeParse("%m/%d/%Y");

        // call method initVis
        this.initVis();

    }

    // init brushVis
    initVis() {
        let vis = this;

        // init margins and svg area
        vis.margin = {top: 0, right: 40, bottom: 30, left: 40};
        vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // x scale and axis
        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.displayData, function (d) {
                return d.birthday;
            }));
        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        // init brush group
        vis.brushGroup = vis.svg.append("g").attr("class", "brush")

        // init brush
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush end", function (event) {
                selectedTimeRange = [vis.x.invert(event.selection[0]), vis.x.invert(event.selection[1])];
                //myBirthMap.wrangleData();
                myWinnerChart.wrangleData();
                myNomineeChart.wrangleData();
                myNormalizedNomChart.wrangleData();
                myNormalizedWinnerChart.wrangleData();
            });

        // append brush group
        vis.svg.append("g")
            .attr("class", "x brush")
            .call(vis.brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", vis.height + 7);

        vis.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // Append x-axis
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis)
    }

    // updateVis
    updateVis() {
        let vis = this;

        // draw x axis
        vis.xAxis.transition().duration(400).call(d3.axisBottom(vis.x));

        // call brush group
        vis.brushGroup
            .call(vis.brush);
    }
}
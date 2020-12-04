/*
 *  NetworkMap - Object constructor function
 *  @param _parentElement    -- HTML element in which to draw the visualization
 *  @param _actorData        -- Array with biographical information of actors
 *  @param _connectionData   -- Array with titles of movies in which actors costar
 *  @param _networkData      -- JSON object outlining nodes and links of costar information
 */

class NetworkMap {

    /*
     *  Constructor method
     */
    constructor(parentElement, actorData, connectionData, networkData) {
        this.parentElement = parentElement;
        this.actorData = actorData;
        this.connectionData = connectionData;
        this.networkData = networkData;

        this.initVis();
    }


    // Initialize network map
    initVis() {
        let vis = this;

        // define margins, width, height
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // create group
        vis.networkGroup = vis.svg.append('g');

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip");

        // init toggle
        vis.toggle = 0;

        // init radius size
        vis.sameRadius = 5;
        vis.smallestRadius = 2;
        vis.biggestRadius = 15;

        // init radius scale
        vis.radius = d3.scaleLinear()
            .range([vis.smallestRadius, vis.biggestRadius]);

        vis.wrangleData();

    }

    // Wrangle data; filtering, sorting, etc
    wrangleData() {
        let vis = this;

        // get new data
        vis.displayData = vis.networkData;

        //console.log(vis.displayData)

        // create connectedBool object for use in node clickability
        vis.connectedBool = {}
        vis.displayData.links.forEach(function(d) {
            vis.connectedBool[`${d.source}, ${d.target}`] = 1;
            vis.connectedBool[`${d.target}, ${d.source}`] = 1;
        });

        // filter for actor info in this decade
        vis.actorNames = vis.displayData.nodes.map(d => d.name);
        vis.filteredActors = vis.actorData.filter(person => vis.actorNames.includes(person.name));

        // Update the visualization
        vis.updateVis();
    }

    // Update visualization
    updateVis() {
        let vis = this;

        // init force simulator
        vis.simulation = d3.forceSimulation(vis.displayData.nodes)
            .force('link', d3.forceLink(vis.displayData.links).id(function(n) {
                return n.id
            }))
            .force("charge", d3.forceManyBody().strength([-600]).distanceMax([250]))
            .force("center", d3.forceCenter(vis.width/2, vis.height/2));

        // initialize the links
        vis.linksGroup = vis.networkGroup.append("g")
            .attr("class", "links");

        vis.links = vis.linksGroup.selectAll("line")
            .data(vis.displayData.links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke-width", 0.1)
            .style("stroke", colorScheme[1]);

        vis.links.exit().remove();

        // initialize the nodes
        vis.nodesGroup = vis.networkGroup.append("g")
            .attr("class", "nodes");

        vis.nodes = vis.nodesGroup.selectAll("circle")
            .data(vis.displayData.nodes)
            .enter()
            .append("circle")
            .attr("r", function(d) {
                // get current actor info
                let current_actor = vis.actorData.filter(d1 => d1.name == d.name)[0];
                return current_actor.n_wins*4+2;
            })
            .attr("fill", colorScheme[0])
            .on("mouseover", function(event, d) {
                // change color of current
                d3.select(this)
                    .transition()
                    .attr('fill', colorScheme[4])
                    .attr('r', 15);

                // place and display tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", function() {
                        return event.pageY < 600 ? `${event.pageY}px` : `${event.pageY - 130}px`
                    })
                    .html(createActorTooltip(getCurrentActor(d.name, vis.actorData)));
            })
            .on("mouseout", function(event, d) {
                // change color of current
                d3.select(this)
                    .transition()
                    .attr('fill', colorScheme[0])
                    .attr("r", function(d) {
                        // get current actor info
                        let currentActor = getCurrentActor(d.name, vis.actorData);
                        return currentActor.n_wins*4+2;
                    })

                // hide tooltip
                vis.tooltip
                    .style('opacity', 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .on('click', function(event, d) {
                // toggle on: show immediate node network
                console.log(vis.toggle);
                if (vis.toggle == 0) {
                    vis.nodes
                        .attr('opacity', function(n) {
                            return vis.connectedBool[`${d.id}, ${n.id}`] ? 1 : 0.1;
                        });
                    d3.select(this).attr('opacity', 1);
                    vis.toggle = 1;
                }
                // toggle off: hide immediate node network
                else {
                    vis.nodes.attr('opacity', 1);
                    vis.toggle = 0;
                }
            });

        vis.nodes.exit().remove();

        // simulation
        vis.simulation.nodes(vis.displayData.nodes).on("tick", function() {
            vis.links
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            vis.nodes
                .attr("cx", function(d) { return d.x = Math.max(5, Math.min(vis.width - 5, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(5, Math.min(vis.height - 5, d.y)); });
        });

        vis.simulation.force("link").links(vis.displayData.links);
    }
}

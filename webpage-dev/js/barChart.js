/*
 *  BarChart - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _actorData       -- Array with biographical information of actors
 *  @param _awardsData      -- Array encoding information about awards of Oscar nominees
 *  @param _nomBool         -- Boolean value denoting whether we're viewing nominees or winners
 *  @param _absoluteBool    -- Boolean value denoting whether or not to normalize data w.r.t. connects
 */

class BarChart {

    /*
     *  Constructor method
     */
    constructor(parentElement, actorData, awardsData, nomBool, absoluteBool) {
        this.parentElement = parentElement;
        this.actorData = actorData;
        this.awardsData = awardsData;
        // if nominees, true; if winners, false
        this.nomBool = nomBool;
        // if absolute counts, true; if relative counts, false
        this.absoluteBool = absoluteBool;

        this.colors = [colorScheme[1], colorScheme[0]];

        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis() {
        let vis = this;

        // init margins and svg area
        vis.margin = {top: 50, right: 20, bottom: 100, left: 60};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // get title
        function getTitle(vis) {
            if (vis.nomBool) {
                if (vis.absoluteBool) {
                    return 'Nominee Connections';
                } else {
                    return 'Normalized Nominee Connections';
                }
            } else {
                if (vis.absoluteBool) {
                    return 'Winner Connections';
                } else {
                    return 'Normalized Winner Connections';
                }
            }
        }

        // add title
        vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text(getTitle(vis))
            .attr('transform', `translate(${vis.width / 2}, -10)`)
            .attr('text-anchor', 'middle');

        // append tooltip
        vis.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .attr('id', 'barTooltip');

        // scales and axes
        vis.colorScale = d3.scaleLinear()
            .range(vis.colors);

        // x scale and axis
        vis.xScale = d3.scaleBand()
            .range([0, vis.width]);
        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale);

        // y scale and axis
        vis.yScale = d3.scaleLinear()
            .rangeRound([vis.height, 0]);
        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale);

        // axes groups
        vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', 'translate(0,' + vis.height + ')');
        vis.svg.append('g')
            .attr('class', 'axis y-axis');

        vis.wrangleData();

    }

    /*
     *  Data wrangling
     */
    wrangleData() {
        let vis = this;

        // filter according to selectedTimeRange, init empty array
        let filteredData = [];

        // if there is a region selected
        if (selectedTimeRange.length !== 0) {
            // iterate over all rows the csv (dataFill)
            vis.actorData.forEach(row => {
                // and push rows with proper dates into filteredData
                if (selectedTimeRange[0].getTime() <= row.birthday && row.birthday <= selectedTimeRange[1].getTime()) {
                    filteredData.push(row);
                }
            });
        } else {
            filteredData = vis.actorData;
        }

        // get user-selected category
        vis.selectedCategory = $('#categorySelector').val();

        // merge data
        let dataByActor = Array.from(d3.group(vis.awardsData, d => d.name), ([key, value]) => ({key, value}));
        vis.actorInfo = [];

        filteredData.forEach(actor => {
            // getting data from actors database
            let actorName = actor.name;
            let actorBirthday = actor.birthday;
            let totCostarFilms = actor.n_costarred_films;
            let uniqueCostarFilms = actor.num_costars;
            let ratio = actor.ratio;

            let awards = []

            // look up type of award for the state in the census data set
            dataByActor.forEach(row => {
                if (row.key === actorName) {
                    for (let i = 0; i < row.value.length; i++) {
                        awards.push([row.value[i].award, row.value[i].win])
                    }
                }
            })
            // nominee chart
            if (vis.nomBool) {
                // category filter
                if (vis.selectedCategory === "ALL") {
                    // if awards is false
                    if (awards[0][1] === false) {
                        // populate the final data structure
                        vis.actorInfo.push(
                            {
                                actor: actorName,
                                actorBirthday: actorBirthday,
                                totCostarFilms: totCostarFilms,
                                uniqueCostarFilms: uniqueCostarFilms,
                                awards: awards[0],
                                ratio: ratio
                            }
                        )
                    }
                } else if (awards[0].includes(vis.selectedCategory)) {
                    if (awards[0][1] === false) {
                        // populate the final data structure
                        vis.actorInfo.push(
                            {
                                actor: actorName,
                                actorBirthday: actorBirthday,
                                totCostarFilms: totCostarFilms,
                                uniqueCostarFilms: uniqueCostarFilms,
                                awards: awards[0],
                                ratio: ratio
                            }
                        )
                    }
                } else {
                }
            }
            // winner chart
            else {
                // category filter
                if (vis.selectedCategory === "ALL") {
                    if (awards[0][1]) {
                        // populate the final data structure
                        vis.actorInfo.push(
                            {
                                actor: actorName,
                                actorBirthday: actorBirthday,
                                totCostarFilms: totCostarFilms,
                                uniqueCostarFilms: uniqueCostarFilms,
                                awards: awards[0],
                                ratio: ratio
                            }
                        )
                    }
                } else if (awards[0].includes(vis.selectedCategory)) {
                    if (awards[0][1]) {
                        // populate the final data structure
                        vis.actorInfo.push(
                            {
                                actor: actorName,
                                actorBirthday: actorBirthday,
                                totCostarFilms: totCostarFilms,
                                uniqueCostarFilms: uniqueCostarFilms,
                                awards: awards[0],
                                ratio: ratio
                            }
                        )
                    }
                } else {
                }
            }
        });

        // if absolute, sort by number of totCostarFilms; if relative, sort by ratio
        if (vis.absoluteBool) {
            vis.actorInfo.sort((a, b) => {
                return b.totCostarFilms - a.totCostarFilms
            });
        } else {
            vis.actorInfo.sort((a, b) => {
                return b.ratio - a.ratio
            });
        }

        // slice top ten actors/actresses with highest number of co-stars or highest ratio
        vis.topTenData = vis.actorInfo.slice(0, 10);

        // update vis
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // update domains
        // distinguish between absolute charts and ratio charts
        if (vis.absoluteBool) {
            vis.maxDomain = d3.max(vis.actorInfo, d => d.totCostarFilms);
            vis.yScale.domain([0, d3.max(vis.topTenData, d => d.totCostarFilms)]);
        } else {
            vis.maxDomain = d3.max(vis.actorInfo, d => d.ratio);
            vis.yScale.domain([0, d3.max(vis.topTenData, d => d.ratio)]);
        }
        vis.colorScale.domain([0, vis.maxDomain])
        vis.xScale.domain(vis.topTenData.map(d => d.actor));

        // draw bars
        vis.bars = vis.svg.selectAll('rect')
            .data(vis.topTenData);
        vis.bars
            .enter()
            .append('rect')
            .merge(vis.bars);

        // fill and attributes of bars and tooltip
        vis.bars
            .enter()
            .append('rect')
            .merge(vis.bars)
            // mouseover
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '0.75px')
                    .attr('fill', colorScheme[4]);

                // get actor info
                let currentActor = getCurrentActor(d.actor, vis.actorData);

                // create tooltip
                let tooltipHTML = createActorTooltip(currentActor, false, true, true);

                // show tooltip
                vis.tooltip
                    .style('opacity', 1)
                    .style('left', function () {
                        return event.pageX + 20 < 900 ? event.pageX + 20 + 'px' : event.pageX - 360 + 'px'
                    })
                    .style('top', event.pageY + 'px')
                    .html(tooltipHTML);
            })
            // mouseout
            .on('mouseout', function (event, d) {
                // reset fill to original
                d3.select(this)
                    .attr('stroke-width', '0.5px')
                    .attr('fill', function (d) {
                        let thisActor = vis.actorInfo.filter(s => s.actor == d.actor)[0];
                        if (typeof thisActor === 'undefined') {
                            return;
                        } else {
                            if (vis.absoluteBool) {
                                return vis.colorScale(thisActor.totCostarFilms);
                            } else {
                                return vis.colorScale(thisActor.ratio);
                            }
                        }
                    })
                // hide tooltip
                vis.tooltip
                    .style('opacity', 0)
                    .style('left', 0)
                    .style('top', 0)
            })
            // bar attributes
            .transition()
            .attr('x', d => vis.xScale(d.actor) + 5)
            .attr('y', function (d) {
                if (vis.absoluteBool) {
                    return vis.yScale(d.totCostarFilms)
                } else {
                    return vis.yScale(d.ratio)
                }
            })
            .attr('width', vis.xScale.bandwidth() - 5)
            .attr('height', function (d) {
                if (vis.absoluteBool) {
                    return (vis.height - vis.yScale(d.totCostarFilms))
                } else {
                    return (vis.height - vis.yScale(d.ratio))
                }
            })
            .attr('stroke-width', '0.5px')
            .attr('fill', function (d) {
                if (vis.absoluteBool) {
                    return vis.colorScale(d.totCostarFilms);
                } else {
                    return vis.colorScale(d.ratio);
                }
            })
        vis.bars.exit().remove();

        // call axes
        vis.svg.select('.x-axis')
            .transition()
            .call(vis.xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        vis.svg.select('.y-axis')
            .transition()
            .call(vis.yAxis);
    }
}

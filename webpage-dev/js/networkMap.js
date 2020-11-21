/*
 *  NetworkMap - Object constructor function
 *  @param _parentElement    -- HTML element in which to draw the visualization
 *  @param _actorData        -- Array with biographical information of actors
 *  @param _connectionMatrix -- Matrix showing number of movies two actors costar in
 *  @param _connectionData   -- Array with titles of movies in which actors costar
 */
class NetworkMap {

    /*
     *  Constructor method
     */
    constructor(parentElement, actorData, connectionMatrix, connectionData) {
        this.parentElement = parentElement;
        this.actorData = actorData;
        this.connectionMatrix = connectionMatrix;
        this.connectionData = connectionData;

        this.initVis();
    }


    /*
     *  Initialize network map
     */
    initVis() {
        let vis = this;

        console.log("actor data:", vis.actorData);
        console.log("connection matrix:", vis.connectionMatrix);
        console.log("connection data:", vis.connectionData);

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

    /*
     *  Updating the visualization
     */
    updateVis() {
        let vis = this;


    }
}

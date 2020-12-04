/* * * * * * * * * * * * * *
*    Helper functions     *
* * * * * * * * * * * * * */

// on decade change, update vis
function categoryChange() {
    myWinnerChart.wrangleData();
    myNomineeChart.wrangleData();
    myNormalizedNomChart.wrangleData();
    myNormalizedWinnerChart.wrangleData();
}

// create tooltip HTML for actor
function createActorTooltip(currentActor, includeIMDB=true, includeCostars = false, includeNormCostars = false) {

    // initialize tooltipHTML with basic components
    let tooltipHTML = `
        <div style="background-color: ${colorScheme[3]}; padding: 10px; text-align: left">
                <img height="100" width="67" src="${currentActor.headshot}" style="float: right; margin-left: 6px; margin-bottom: 6px">
                 <h5>${currentActor.name}</h5>
                 <p>
                     <strong>Birthday:</strong> ${formatDate(currentActor.birthday)}<br>
                     <strong>Birthplace:</strong> ${currentActor.birthplace}<br>
                     <strong>Number of Oscar nominations:</strong> ${JSON.stringify(currentActor.n_noms)}<br>
                     <strong>Number of Oscar wins:</strong> ${JSON.stringify(currentActor.n_wins)}<br>`;

    // include costars info if indicated
    if (includeCostars) {
        tooltipHTML += `<strong>Number of unique costars:</strong> ${JSON.stringify(currentActor.num_costars)}<br>`;
    }

    // include normalized costar info if indicated
    if (includeNormCostars) {
        tooltipHTML += `<strong>Average Oscar-nominated costars per film:</strong> ${currentActor.ratio.toFixed(1)}<br>`;
    }

    // include IMDB link if indicated
    if (includeIMDB) {
        tooltipHTML += `<a href="${currentActor.imdb_url}">IMDb page</a><br>`;
    }

    // finish off tooltip
    tooltipHTML += `</p></div>`;

    return tooltipHTML
}

// get actor info from name
function getCurrentActor(actorName, actorData) {
    return actorData.filter(d1 => d1.name == actorName)[0]
}
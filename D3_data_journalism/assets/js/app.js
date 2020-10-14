d3.csv("assets/data/data.csv").then(function(riskData) {
    console.log(riskData);

    // Make a list of State Abbrv
    let stateAbbr = riskData.map(data => data.abbr);
    console.log("State Abbrevation", stateAbbr);

    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Cast each hours value in tvData as a number using the unary + operator
    // tvData.forEach(data => {
    //   data.hours = +data.hours;
    //   console.log("Name:", data.name);
    //   console.log("Hours:", data.hours);
    // });

}).catch(error => console.log(error));

// Set the margins
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
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Get the data with a promise and fulfillment
d3.csv("assets/data/data.csv").then(function(riskData) {

    // Make a list of State Abbrv
    let stateAbbr = riskData.map(data => data.abbr);

    //Parse Data/Cast as numbers
    riskData.forEach(data => {
        data.age = +data.age;
        data.income = +data.income;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(riskData, d => d.age)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(riskData, d => d.income)])
        .range([height, 0]);
    
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(riskData)
        .join("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.income))
        .attr("r", "15")
        .attr("fill", "purple")
        .attr("opacity", .5)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    // Add State Abbrevations to each scatter point

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        // .attr("dy", "1em")
        .attr("class", "axis-text")
        .text("Income");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axis-text")
        .text("Age");

}).catch(error => console.log(error));

   
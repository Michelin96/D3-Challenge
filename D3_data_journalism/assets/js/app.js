// Set the margins
let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Get the data with a promise and fulfillment
d3.csv("assets/data/data.csv").then(function(riskData) {

    //Parse Data/Cast as numbers
    riskData.forEach(data => {
        data.age = +data.age;
        data.income = +data.obesity;
    });

    // Create scale functions
    let xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(riskData, d => d.age)])
        .range([0, width]);
    
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(riskData, d => d.obesity)])
        .range([height, 0]);
    
    // Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);


    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axis-text")
        .text("Obesity");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axis-text")
        .text("Age");

    // Create Circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(riskData)
        .join("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "purple")
        .attr("opacity", .5)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        
    // Create State Abbr Labels
    const label = chartGroup.append("g")
        .selectAll("circle")
        .data(riskData)
        .join("text")
        .attr("dy", "0.35em")
        .attr("x", d => d.age)
        .attr("y", d => d.obesity)
        .attr("class", "stateText")
        .text(d => d.abbr);

}).catch(error => console.log(error));


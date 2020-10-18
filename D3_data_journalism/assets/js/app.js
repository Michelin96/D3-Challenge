// Set the margins
let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 150,
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

//  Initial Axes Selections
let selectXAxis = "poverty";
let selectYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(riskData, selectXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(riskData, d => d[selectXAxis]) * 0.8,
        d3.max(riskData, d => d[selectXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

  // function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, selectXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[selectXAxis]));
  
    return circlesGroup;
  }

// Get the data with a promise and fulfillment
d3.csv("assets/data/data.csv").then(function(riskData) {

    //Parse Data/Cast as numbers
    riskData.forEach(data => {
        data.age = +data.age; // X axis
        data.income = +data.income; // X axis
        data.poverty = +data.poverty; // X axis
        data.healthcare = +data.healthcare; // Y axis
        data.smokes = +data.smokes; // Y axis
        data.obesity = +data.obesity; // Y axis
    });

    // xLinearScale function above csv import
    let xLinearScale = xScale(riskData, selectXAxis);

    //  // yLinearScale function above csv import
    // let yLinearScale = yScale(riskData, chosenYAxis);

    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(riskData, d => d.healthcare)])
        .range([height, 0]);
    
    // Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Append X axis to the chart
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    // Append Y axis
    chartGroup.append("g")
        .call(leftAxis);

    // Create initial circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(riskData)
        .join("circle")
        .attr("cx", d => xLinearScale(d[selectXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "purple")
        .attr("opacity", .5)
        .attr("stroke", "black")
        .attr("stroke-width", 1)

    let labelGroup =  chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)

    let ageLabel = labelGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .classed("axis-text", true)
        .text("Age(Median)");
    
    let incomeLabel = labelGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .classed("axis-text", true)
        .text("Income(Median)");
    
    let povertyLabel = labelGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .classed("axis-text", true)
        .text("In Poverty(%)");
    
    // Create Y axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "2em")
        .attr("class", "axis-text")
        .text("Lacks Healthcare(%)");

    // Create State Abbr Labels
    circlesGroup.selectAll("circle")
        .data(riskData)
        .join("text")
        .attr("dy", "0.35em")
        .attr("x", d => xLinearScale(d.selectXAxis))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("class", "stateText")
        .text(d => d.abbr);
   
        // x axis labels event listener
    labelGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        let value = d3.select(this).attr("value");
        // if (value !== selectXAxis) {

        // replaces chosenXAxis with value
        selectXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(riskData, selectXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, selectXAxis);

        // Changed selected axis to bold and others to regular
        switch (selectXAxis) {
            case age:
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                break;
            case income:
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                break;
            case poverty:
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                break;
            }
        // }
    });
}).catch(error => console.log(error));

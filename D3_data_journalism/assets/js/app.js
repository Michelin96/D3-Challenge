// Set the margins
let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 60,
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
    let xLinearScale = d3.scaleLinear()
      .domain([d3.min(riskData, d => d[selectXAxis]) * 0.8,
        d3.max(riskData, d => d[selectXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  }

// function used for updating y-scale var upon click on axis label
function yScale(riskData, selectYAxis) {
    // create scales
   let yLinearScale = d3.scaleLinear()
        .domain([d3.min(riskData, d => d[selectYAxis]) * 0.8,
        d3.max(riskData, d => d[selectYAxis]) * 1.2
        ])
        .range([height, 0]);
  
    return yLinearScale;
  }

  // function used for updating xAxis var upon click on axis label
function renderAxisX(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

function renderAxisY(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, selectXAxis, selectYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[selectXAxis]))
        .attr("cy", d => newYScale(d[selectYAxis]));

    return circlesGroup;
}

// function used for updating state text group with a transition to
// new circles
function renderText(stateLabel, newXScale, newYScale, selectXAxis, selectYAxis) {

    stateLabel.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[selectXAxis]))
        .attr("y", d => newYScale(d[selectYAxis]));

    return stateLabel;
}

// Get the data with a promise and fulfillment
d3.csv("D3_data_journalism/assets/data/data.csv").then(function(riskData) {

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

    // yLinearScale function above csv import
    let yLinearScale = yScale(riskData, selectYAxis);
    
    // Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Append X axis to the chart
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    // Append Y axis to the chart
    let yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Create initial circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(riskData)
        .join("circle")
        .attr("cx", d => xLinearScale(d[selectXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "purple")
        .attr("opacity", .5)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
    
    // Create State Abbr Labels
    let stateLabel = chartGroup.append("g")
        .selectAll("circle")
        .data(riskData)
        .join("text")
        .attr("dy", "0.35em")
        .attr("x", d => xLinearScale(d[selectXAxis]))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("class", "stateText")
        .text(d => d.abbr);

    let xLabelGroup =  chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr("x", 0)
        .classed("axis-text", true);
    
    let  yLabelGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        // .attr("x", 0 - (height / 2))
        // .attr("dy", "2em")
        // .classed("axis-text", true)

    let ageLabel = xLabelGroup.append("text")
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
    
    let incomeLabel = xLabelGroup.append("text")
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income (Median)");
    
    let povertyLabel = xLabelGroup.append("text")
        .attr("y", 60)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
    
    // Create Y axis labels
    let obesityLabel = yLabelGroup.append("text")
        .attr("y", 0 - margin.left - 25)
        .attr("x", 0 - (height / 2))
        .attr("dy", "2em")
        .classed("inactive", true)
        .classed("axis-text", true)
        .attr("value", "obesity") // value to grab for event listener
        .text("Obese (%)");

    let smokesLabel = yLabelGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "2em")
        .classed("inactive", true)
        .classed("axis-text", true)
        .attr("value", "smokes") // value to grab for event listener
        .text("Smokes (%)");

    let healthLabel = yLabelGroup.append("text")
        .attr("y", 0 - margin.left + 25)
        .attr("x", 0 - (height / 2))
        .attr("dy", "2em")
        .classed("active", true)
        .classed("axis-text", true)
        .attr("value", "healthcare") // value to grab for event listener
        .text("Lacks Healthcare (%)");

     //Axis labels event listener
    chartGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        let value = d3.select(this).attr("value");
        
        // Changes selected axis to bold and others to inactive, and defines new axis values
        switch (value) {
            case "age":
                selectXAxis = value;
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

            case "income":
                selectXAxis = value;
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

            case "poverty":
                selectXAxis = value;
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

            case "obesity":
                selectYAxis = value;
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                break;

            case "smokes":
                selectYAxis = value;
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
            break;

            case "healthcare":
                selectYAxis = value;
                healthLabel
                    .classed("active", true)
                    .classed("inactive", false);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
            break;
            }

        // functions here found above csv import
        // updates axis scales for new data
        xLinearScale = xScale(riskData, selectXAxis);
        yLinearScale = yScale(riskData, selectYAxis);

        // updates axes with transition
        xAxis = renderAxisX(xLinearScale, xAxis);
        yAxis = renderAxisY(yLinearScale, yAxis);

        // updates circles with new axis values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, selectXAxis, selectYAxis);
        // updates state label with new axis values
        stateLabel = renderText(stateLabel, xLinearScale, yLinearScale, selectXAxis, selectYAxis);

    });
}).catch(error => console.log(error));

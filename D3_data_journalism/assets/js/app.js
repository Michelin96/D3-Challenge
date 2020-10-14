d3.csv("assets/data/data.csv").then(function(riskData) {

    console.log(riskData);

    // log a list of State Abbrv
    var stateAbbr = riskData.map(data => data.abbr);
    console.log("State Abbrevation", stateAbbr);

    // Cast each hours value in tvData as a number using the unary + operator
    // tvData.forEach(data => {
    //   data.hours = +data.hours;
    //   console.log("Name:", data.name);
    //   console.log("Hours:", data.hours);
    // });

}).catch(error => console.log(error));

d3.csv("assets/data/data.csv").then(function(riskData) {

    console.log(riskData);

    // // log a list of names
    // var names = tvData.map(data => data.name);
    // console.log("names", names);

    // // Cast each hours value in tvData as a number using the unary + operator
    // tvData.forEach(data => {
    //   data.hours = +data.hours;
    //   console.log("Name:", data.name);
    //   console.log("Hours:", data.hours);
    // });

}).catch(error => console.log(error));

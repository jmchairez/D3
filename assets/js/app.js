// @TODO: YOUR CODE HERE!
var svgHeight = 500;
var svgWidth = 800;

var margin = {
    top: 30,
    right: 20,
    bottom: 70,
    left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select(".scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(dabblerData){
    console.log(dabblerData);

    dabblerData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(dabblerData, d => d.obesity)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(dabblerData, d => d.poverty)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis)

    chartGroup.append("g")
        .call(leftAxis)

    var circlesGroup = chartGroup.selectAll("circle")
        .data(dabblerData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    chartGroup.selectAll("stateText")
        .data(dabblerData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("class", "stateTxt")
        .attr("dx", d => xLinearScale(d.obesity)-5)
        .attr("dy", d => yLinearScale(d.poverty)+5)
        .attr("font-size", 9)

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state},<br>Obesity: ${d.obesity}<br>Poverty: ${d.poverty}`);
        });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty");

    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
    .attr("class", "axisText")
    .text("Obesity");
}).catch(function(error) {
  console.log(error);
});

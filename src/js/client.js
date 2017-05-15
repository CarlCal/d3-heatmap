
import "../styles/main.css"

import * as d3 from "d3"
import axios from "axios"

const URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],  
      colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"]

axios.get(URL)
  .then(function (response) {

    var data = response.data.monthlyVariance,
        baseTemp = response.data.baseTemperature

    const margin = { top: 10, right: 10, bottom: 90, left: 90 },
          width = 1200 - margin.left - margin.right,
          height = 550 - margin.top - margin.bottom,
          legendWidth = 40,
          legendHeight = 20

    var chart = d3.select(".chart")

    var minYear = d3.min(data, function(d) { return d.year }),
        maxYear = d3.max(data, function(d) { return d.year })

    var x = d3.scaleLinear().range([0, width])
        .domain([minYear, maxYear])

    var y = d3.scaleBand().range([0, height])
        .domain(data.map(function(d) { return (d.month - 1) }))

    var g = chart.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    /*Appending a x axis*/
    var xAxis = g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + (height + 1) + ")")
      .call(d3.axisBottom(x).ticks(26).tickFormat(d3.format("")))
    .append("text")
      .attr("x", (width / 2))
      .attr("y", 45)
      .attr("text-anchor", "center")
      .attr("fill", "black")
      .style("font-size", "18px")
      .text("Years")

    xAxis.exit().remove()

    /*Appending a y axis*/
    var yAxis = g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(-1, 0)")
      .call(d3.axisLeft(y).ticks(12).tickFormat(function(d, i) { return months[i] }))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", (-height / 2))
      .attr("y", -70)
      .attr("dx", "1.80em")
      .attr("text-anchor", "center")
      .attr("fill", "black")
      .style("font-size", "18px")
      .text("Months")

    yAxis.exit().remove()

    var totalTemp = data.map(function(d) { return baseTemp + d.variance })

    var formatLabel = d3.format("0.2f")

    var colorScale = d3.scaleQuantile()
      .domain([d3.min(totalTemp), d3.max(totalTemp)])
      .range(colors)
    
    var cards = g.append("g")
        .attr("class", "cards")
      .selectAll(".temp")
        .data(data)
        .enter()
      .append("rect")
        .attr("x", function(d) { return x(d.year) })
        .attr("y", function(d) { return y(d.month - 1) })
        .attr("class", "temp")
        .attr("width", 5)
        .attr("height", y.bandwidth() + 1)
        .style("fill", function(d) { return colorScale(baseTemp+d.variance)})

    cards.exit().remove()

    var legend = g.append("g")
        .attr("class", "legendSpectrum")
      .selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d })
        .enter()
      .append("g")
        .attr("class", "legend")

    legend.append("rect")
        .attr("x", function(d, i) { return (width-(legendWidth*colors.length))+(i*legendWidth) })
        .attr("y", height + 50)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", function(d, i) { return colors[i] })
    
    legend.append("text")
        .attr("class", "legendLabel")
        .attr("x", function(d, i) { return (width-(legendWidth*colors.length))+(i*legendWidth) + 5 })
        .attr("y", height + legendHeight + 65)
        .attr("fill", "black")
        .attr("text-anchor", "center")
        .style("font-size", "14px")
        .text(function(d) { return formatLabel(d) })

    legend.exit().remove()


    /*TOOL TIP*/

  })
  .catch(function (error) {
   console.error(error);
  });

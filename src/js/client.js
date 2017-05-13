
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
          height = 550 - margin.top - margin.bottom

    var chart = d3.select(".chart")

    var minYear = d3.min(data, function(d) { return d.year }),
        maxYear = d3.max(data, function(d) { return d.year })

    var x = d3.scaleLinear().range([0, width])
        .domain([minYear, maxYear])

    var y = d3.scaleLinear().range([0, height])
        .domain([0, d3.max(data, function(d) { return d.month })])

    var g = chart.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + (height + 0) + ")")
      .call(d3.axisBottom(x).ticks(26).tickFormat(d3.format("")))
    .append("text")
      .attr("x", (width/2))
      .attr("y", 70)
      .attr("text-anchor", "center")
      .attr("fill", "black")
      .style("font-size", "18px")
      .text("Years")

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(12).tickFormat(function(d, i) { return months[i] }))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", (-height/2))
      .attr("y", -70)
      .attr("dx", "1.80em")
      .attr("text-anchor", "center")
      .attr("fill", "black")
      .style("font-size", "18px")
      .text("Months")


  })
  .catch(function (error) {
   console.error(error);
  });

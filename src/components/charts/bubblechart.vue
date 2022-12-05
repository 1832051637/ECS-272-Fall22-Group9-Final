<template>
    <div id="bubble"></div>
</template>

<script>
    import * as d3 from "d3";

    const CPI_DATA = window.location.origin + "/src/assets/data/cpi_data.csv";
    const GOV_DATA = window.location.origin + "/src/assets/data/gov_data.csv";
    const RATE_DATA = window.location.origin + "/src/assets/data/confirmed_rate_data.csv";

    export default {
        name: 'BubbleChart',
        data() {
            return {
                country_list: ['Belgium', 'Albania', 'Iceland', 'Honduras', 'Estonia', 'China',
                            'Dominican', 'Denmark', 'Georgia', 'Guatemala', 'Chile', 'Indonesia',
                            'Hungary', 'Greece', 'Cyprus', 'Korea', 'Rwanda', 'Netherlands',
                            'Luxembourg', 'Slovenia', 'Mexico', 'Pakistan', 'Latvia', 'Norway', 'Moldova',
                            'Portugal', 'US', 'Turkey', 'Vietnam', 'Switzerland', 'Uganda',
                            'Thailand', 'Ukraine'],
                color_list: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896',
                            '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7',
                            '#bcbd22', '#dbdb8d', '#17becf', '#9edae5', '#C7B446', '#1B5583', '#0d6efd', '#A65E2E',
                            '#CB2821', '#B32428', '#75151E', '#E1CC4F', '#D95030', '#A03472', '#287233', '#F8F32B', '#343a40'],
                date_array: [],
                tooltip: null,
                margin: { top: 40, right: 150, bottom: 40, left: 80 },
                width: 1000,
                height: 480,
            }
        },
        props:{
            mycpiData: Object,
            mygovData: Object,
            myrateData: Object,
            curr_date_index: Number,
        },
        mounted(){
            console.log("Mounted: Bubble data", this.curr_date_index);
            this.set_date_array();
            this.init('#bubble');
            this.drawBubble();
        },
        updated(){
            console.log("Updated: Bubble data");
            console.log("Current Bubble date: ", this.curr_date_index);
            this.drawBubble();
        },
        methods: {
            set_date_array() {
                for (var i=2; i < 13; i++){
                    this.date_array.push("2020-"+String(i))
                };
                for (var i=1; i < 13; i++){
                    this.date_array.push("2021-"+String(i))
                };
                for (var i=1; i < 11; i++){
                    this.date_array.push("2022-"+String(i))
                }
                console.log("Date array for bubble", this.date_array);
                },
            init(id){
                let svg = d3.select(id).append("svg")
                        .attr("class", "bubbleChart")
                        .attr("viewBox", [0, 0, this.width, this.height])
                        .attr("width", this.width + this.margin.left + this.margin.right)
                        .attr("height", this.height + this.margin.top + this.margin.bottom);

                svg.append("g").attr("id", "bubbleXAxisGroup")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
                    
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", 530)
                    .attr("y", 480)
                    .attr("font-size", 15)
                    .attr("fill", "black")
                    .text("Confirmed Rate (%)");

                svg.append("g").attr("id", "bubbleYAxisGroup")
                    .attr("class", "y-axis")
                    .attr("transform", `translate(${this.margin.left},0)`)

                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("font-size", 15)
                    .attr("fill", "black")
                    .attr("transform", "translate(30,130) rotate(-90)")
                    .text("Consumer Price Index");

                svg.append("g").attr("id", "circleGroup");
                
                d3.select(id).append("div")
                    .attr("id", "bubble_mouse_handler")
                    .style("position", "absolute")

                // add legends
                // Add legend: circles
                // Add a scale for bubble size
                svg.append("g").attr("id", "bubbleLegendGroup");
                let z = d3.scaleLinear()
                    .domain([0, 80])
                    .range([0, 70]);
                var valuesToShow = [5, 20, 40];
                var xCircle = 750;
                var xLabel = 805;
                svg
                .selectAll("legend")
                .data(valuesToShow)
                .enter()
                .append("circle")
                    .attr("cx", xCircle)
                    .attr("cy", function(d){ return 80 - z(d) } )
                    .attr("r", function(d){ return z(d) })
                    .style("fill", "none")
                    .attr("stroke", "black")

                // Add legend: segments
                svg
                .selectAll("legend")
                .data(valuesToShow)
                .enter()
                .append("line")
                    .attr('x1', function(d){ return xCircle + z(d) } )
                    .attr('x2', xLabel)
                    .attr('y1', function(d){ return 80 - z(d) } )
                    .attr('y2', function(d){ return 80 - z(d) } )
                    .attr('stroke', 'black')
                    .style('stroke-dasharray', ('4,2'))

                // Add legend: labels
                svg
                .selectAll("legend")
                .data(valuesToShow)
                .enter()
                .append("text")
                    .attr('x', xLabel+5)
                    .attr('y', function(d){ return 80 - z(d) } )
                    .text( function(d){ return d } )
                    .style("font-size", 12)
                    .attr('alignment-baseline', 'middle')

                // Legend title
                svg.append("text")
                .attr('x', xCircle)
                .attr("y", 100)
                .style("font-size", 12)
                .text("Government Response Index")
                .attr("text-anchor", "middle")
            },

            drawBubble() {
                //y-axis: cpi, x-axis: confirmed rate, r: gov response index
                let cpi_data = this.mycpiData;
                let rate_data = this.myrateData;
                let gov_data = this.mygovData;
                let country_list = this.country_list;
                let color_list = this.color_list;
                let current_date = this.date_array[this.curr_date_index];

                var data = [];
                for (var i = 0; i < country_list.length; i++){
                    var cpi_idx = cpi_data.map(function(d) { return d.country_name; }).indexOf(country_list[i]);
                    var gov_idx = gov_data.map(function(d) { return d.country_name; }).indexOf(country_list[i]);
                    var rate_idx = rate_data.map(function(d) { return d.country_name; }).indexOf(country_list[i]);
                    data.push({country: country_list[i], cpi: +cpi_data[cpi_idx][current_date], 
                                gov: +gov_data[gov_idx][current_date], rate: +rate_data[rate_idx][current_date],
                                color: color_list[i]});
                };

                let x = d3.scaleLinear()
                    .domain([0, 60])
                    .rangeRound([this.margin.left, this.width - this.margin.right]);

                let y = d3.scaleLinear()
                    // .domain([d3.min(data, d => +d.cpi), d3.max(data, d => +d.cpi)]).nice()
                    .domain([0, 1100])
                    .rangeRound([ this.height - this.margin.bottom, this.margin.top ]);

                const xAxis = g => g
                    .call(d3.axisBottom(x))

                const yAxis = g => g
                    .call(d3.axisLeft(y))

                d3.select("#bubbleXAxisGroup")
                    .call(xAxis);

                d3.select("#bubbleYAxisGroup") 
                    .call(yAxis);
                
                // Add a scale for bubble size
                let z = d3.scaleLinear()
                    .domain([0, 80])
                    .range([0, 70]);

                let size = 20
                let x_country_label1 = 850;
                d3.select('#bubbleLegendGroup')
                .selectAll("myrect1")
                .data(country_list.slice(0, 16))
                .join(
                    enter => {enter.append("circle")
                                    .attr("cx", x_country_label1)
                                    .attr("cy", function(d,i){ return 10 + i*(size+5) })
                                    .attr("r", 7)
                                    .attr("fill", function(d, i) { return color_list[i] })},
                    // update => {update
                    //                 .attr("cx", x_country_label1)
                    //                 .attr("cy", function(d,i){ return 10 + i*(size+5) })
                    //                 .attr("r", 7)},
                    exit => exit.remove()
                    );    

                // Add labels beside legend dots
                d3.select('#bubbleLegendGroup')
                .selectAll("mylabels1")
                .data(country_list.slice(0, 16))
                .join(
                    enter => {enter.append("text")
                                    .attr("x", x_country_label1 + size*.8)
                                    .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                                    .text(function(d){ return d})
                                    .attr("text-anchor", "left")
                                    .style("alignment-baseline", "middle")
                                    .attr("fill", function(d, i) { return color_list[i] })},
                    // update => {update
                    //                 .attr("x", x_country_label1 + size*.8)
                    //                 .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                    //                 .text(function(d){ return d})
                    //                 .attr("text-anchor", "left")
                    //                 .style("alignment-baseline", "middle")
                    //                 .attr("fill", function(d, i) { return color_list[i] })},
                    exit => exit.remove()
                    );  

                let x_country_label2 = 930;
                d3.select('#bubbleLegendGroup')
                .selectAll("myrect2")
                .data(country_list.slice(16, 34))
                .join(
                    enter => {enter.append("circle")
                                    .attr("cx", x_country_label2)
                                    .attr("cy", function(d,i){ return 10 + i*(size+5) })
                                    .attr("r", 7)
                                    .attr("fill", function(d, i) { return color_list[i+16] })},
                    // update => {update
                    //                 .attr("cx", x_country_label2)
                    //                 .attr("cy", function(d,i){ return 10 + i*(size+5) })
                    //                 .attr("r", 7)},
                    exit => exit.remove()
                    );    

                // Add labels beside legend dots
                d3.select('#bubbleLegendGroup')
                .selectAll("mylabels2")
                .data(country_list.slice(16, 34))
                .join(
                    enter => {enter.append("text")
                                    .attr("x", x_country_label2 + size*.8)
                                    .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                                    .text(function(d){ return d})
                                    .attr("text-anchor", "left")
                                    .style("alignment-baseline", "middle")
                                    .attr("fill", function(d, i) { return color_list[i+16] })},
                    // update => {update
                    //                 .attr("x", x_country_label2 + size*.8)
                    //                 .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                    //                 .text(function(d){ return d})
                    //                 .attr("text-anchor", "left")
                    //                 .style("alignment-baseline", "middle")
                    //                 .attr("fill", function(d, i) { return color_list[i+16] })},
                    exit => exit.remove()
                    );  

                const bubble_mouse_handler = d3.select("#bubble_mouse_handler")
                    .attr("class", "tooltip")
                    .style('font-size', '12px')

                let mouseOver = function(event, d){
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("opacity", 1)
                            .style("stroke", "black")
                            .style("stroke-width", 4)

                        bubble_mouse_handler
                            .html("<span><b>" + d.country + "</b><br>" +
                                "<b>CPI: </b>" + d3.format(",.2f")(d.cpi) + "<br>" +
                                "<b>Confirmed Rate: </b>" + d3.format(",.2f")(d.rate) + "%<br>" + 
                                "<b>Government Response Index: </b>" + d3.format(",.2f")(d.gov) + "</span>")
                            .transition()
                            .duration(500)
                            .style("opacity", 1)
                }

                let mouseMove = function(event, d) {
                    console.log(event)

                    bubble_mouse_handler
                        .style("left", (event.offsetX) + 260 + "px")
                        .style("top", (event.offsetY) + 80+ "px")
            }

                let mouseOut = function(event, d){
                    bubble_mouse_handler
                        .style("opacity", 0)
                    d3.selectAll("circle")
                        .transition()
                        .duration(200)
                        .style("opacity", 0.9)
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("stroke", "none")
                }

                // Initialize dots with group a
                d3.select("#circleGroup")
                    .selectAll('circle')
                    .data(data)
                    .join(
                        enter => {enter.append("circle")
                                        .attr("cx", function(d) { return x(+d.rate) })
                                        .attr("cy", function(d) { return y(+d.cpi) })
                                        .attr("r", function(d) { return z(+d.gov) })
                                        .attr("fill", function(d) { return d.color })
                                        .style("opacity", 0.8)
                                        .on("mouseover", mouseOver)
                                        .on("mousemove", mouseMove)
                                        .on("mouseout", mouseOut)},
                        update => {update.transition()
                                        // .delay(function(d, i){return i*3})
                                        .duration(800)
                                        .attr("cx", function(d) { return x(+d.rate) })
                                        .attr("cy", function(d) { return y(+d.cpi) })
                                        .attr("r", function(d) { return z(+d.gov) })},
                        exit => exit.remove()
                    );                    
            },
        }
    }

</script>


<style>
</style>
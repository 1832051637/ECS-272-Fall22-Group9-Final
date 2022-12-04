<template>
    <div class="bubbleChartContainer">
        <h1 class="bubbleChartTitle">Bubble Chart</h1>
        <div id="bubbleWrapper" class="bubbleChart">
            <svg id="bubble" :height="height" :width="width"></svg>
        </div>
    </div>
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
                            '#bcbd22', '#dbdb8d', '#17becf', '#9edae5', '#C7B446', '#1B5583', '#354D73', '#A65E2E',
                            '#CB2821', '#B32428', '#75151E', '#E1CC4F', '#D95030', '#A03472', '#287233', '#F8F32B', '#8F8F8F'],
                current_date: null,
                tooltip: null,
                margin: {},
                width: 500,
                height: 500,
            }
        },
        props:{
            mycpiData: Object,
            mygovData: Object,
            myrateData: Object,
            current_date: String,
        },
        mounted(){
            console.log("Mounted: Bubble data", this.myrateData);
            this.init('#bubble');
            this.drawBubble();
        },
        updated(){
            console.log("Updated: Bubble data");
            console.log("Current Bubble date: ", this.current_date);
            this.drawBubble();
        },
        methods: {
            init(id){
                this.margin = { top: 10, right: 20, bottom: 40, left: 20 };
                this.width = document.getElementById("bubbleWrapper").clientWidth ;
                this.height = document.getElementById("bubbleWrapper").clientHeight;
                this.cpi_data = this.mycpiData;
                this.gov_data = this.mygovData;
                this.rate_data = this.myrateData;
                let svg = d3.select(id);
                svg.append("g").attr("id", "bubbleXAxisGroup")
                    .append("text")
                    .style("text-anchor", "end")
                    .style("font-size", 12)
                    .style("fill", "black")
                    .text("Confirmed Rate (%)");
                svg.append("g").attr("id", "bubbleYAxisGroup")
                    .append("text")
                    .style("text-anchor", "start")
                    .style("font-size", 12)
                    .style("fill", "black")
                    .text("CPI");
                svg.append("g").attr("id", "circleGroup");
                
                this.tooltip = d3.select("#bubbleWrapper").append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("width", "fit-content")
                    .style("padding", "4px")
                    .style("position", "relative")
            },

            drawBubble() {
                //y-axis: cpi, x-axis: confirmed rate, r: gov response index
                let cpi_data = this.mycpiData;
                let rate_data = this.myrateData;
                let gov_data = this.mygovData;
                let country_list = this.country_list;
                let color_list = this.color_list;
                let current_date = this.current_date;
                let vueThis = this;

                let date = "2020-2";
                var data = [];
                for (var i = 0; i < country_list.length; i++){
                    var cpi_idx = cpi_data.map(function(d) { return d.country_name; }).indexOf(country_list[i]);
                    var gov_idx = gov_data.map(function(d) { return d.country_name; }).indexOf(country_list[i]);
                    var rate_idx = rate_data.map(function(d) { return d.country_name; }).indexOf(country_list[i]);
                    data.push({country: country_list[i], cpi: cpi_data[cpi_idx][date], 
                                gov: gov_data[gov_idx][date], rate: rate_data[rate_idx][date],
                                color: color_list[i]});
                };
                console.log("output data for 2020-2: ", data);

                let x_axis = d3.scaleLinear()
                    .domain([0, 100])
                    .range([this.margin.left, this.width - this.margin.right]);

                let y_axis = d3.scaleLinear()
                    .domain([[d3.min(data, function(d){ return d.cpi;}), d3.max(data, function(d){ return d.cpi;})]])
                    .range([ this.height - this.margin.bottom, this.margin.top ]);

                d3.select("#bubbleXAxisGroup")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
                    .call(d3.axisBottom(x_axis));

                d3.select("#bublleYAxisGroup")
                    .attr("class", "y-axis")
                    .attr("transform", `translate(${this.margin.left},0)`)
                    .call(d3.axisLeft(y_axis).ticks(200));
                
                let mouseOver = function(d){
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .style("opacity", 1)
                            .style("stroke", "black")
                            .style("stroke-width", 4)
                        vueThis.tooltip.style("opacity", 1)
                            .html(d.country +":<br>Confirmed rate is "+d3.format(",.2f")(d.rate)+"%<br>CPI is ")
                            .style("left", (d3.mouse(this)[0]) + "px")
                            .style("top", (d3.mouse(this)[1]) + "px")
                }

                let mouseLeave = function(d){
                    vueThis.tooltip.style("opacity", 0)
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
                                        .attr("cx", function(d) { return x_axis(+d.rate) })
                                        .attr("cy", function(d) { return y_axis(+d.cpi) })
                                        .attr("r", function(d) { return Math.sqrt(d.gov)/Math.PI })
                                        .attr("fill", function(d) { return d.color })
                                        .on("mouseover", mouseOver)
                                        .on("mouseleave", mouseLeave)},
                        update => {update.attr("cx", function(d) { return x_axis(+d.rate) })
                                        .attr("cy", function(d) { return y_axis(+d.cpi) })
                                        .attr("r", function(d) { return Math.sqrt(d.gov)/Math.PI })},
                        exit => exit.remove()
                    );                    
            },
        }
    }

</script>


<style scoped>
    .bubbleChartContainer{
        height: 100%;
        background-color: #ffffff;
    }
    .overviewTitle{
        font-size: 3em;
        width: 100%;
        background-color: #ffffff;
        color: #1a1919;
        text-align: center;
        margin: 0;
        height: 10%;
    }
    .bubbleChart{
        height: 90%;
        font-size: 15px;
        background-color: #ffffff;
    }
</style>
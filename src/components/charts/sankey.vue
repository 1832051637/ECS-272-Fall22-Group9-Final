<template>
    <div id="sankey" class="mt-4 align-item-center"></div>
</template>

<script>
import * as d3 from "d3";
import { d3_sankey } from '../../js/sankey.js'

export default {
    name: "SankeyGraph",
    data() {
        return {
            id: "#sankey"
        }
    },
    props: {
        all_sankey_data: Object,
        curr_date: String,
    },
    mounted() {
        console.log("Sankey is mounted")
        console.log(this.all_sankey_data)
        this.initialize_sankey()
        this.draw_sankey()
    },
    updated() {
        console.log("Sankey is updated")
        // this.draw_sankey()
    },
    methods: {
        initialize_sankey() {
            let svg = d3.select(this.id).append("svg")
            svg.append("g").attr("id", "sankey_link_group");
            svg.append("g").attr("id", "sankey_node_group");

        },
        draw_sankey() {
            const margin = { top: 10, right: 10, bottom: 10, left: 10 };
            const height = 600;
            const width = 900;
            let units = "Widgets";


            // format variables
            let formatNumber = d3.format(",.0f"),    // zero decimal places
                format = function (d) { return formatNumber(d) + " " + units; },
                color = d3.scaleOrdinal(d3.schemeCategory10);
            let svg = d3.select(this.id).select("svg")
                .attr("class", "sankeyChart")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            let sankey = d3_sankey()
                .nodeWidth(36)
                .nodePadding(40)
                .size([width, height]);
            let path = sankey.links()
            // console.log(path)
            let graph = this.all_sankey_data[this.curr_date]
            console.log(graph)
            graph.links.forEach(function (d, i) {
                graph.links[i].source = graph.nodes.map(object => object.name).indexOf(d.source);
                graph.links[i].target = graph.nodes.map(object => object.name).indexOf(d.target);
            });

            sankey
                .nodes(graph.nodes)
                .links(graph.links)
                .layout(32);

            let link = svg.select("#sankey_link_group")
                .selectAll(".link")
                .data(graph.links)
                .join("path")
                .attr("class", "link")
                .attr("d", path)
                .style("stroke-width", function (d) { return Math.max(1, d.dy); })
                .sort(function (a, b) { return b.dy - a.dy; })

            link.append("title")
                .text(function (d) {
                    return d.source.name + " → " +
                        d.target.name + "\n" + format(d.value);
                });

            let node = svg.select("#sankey_node_group")
                .selectAll(".node")
                .data(graph.nodes)
                .join("g")
                .attr("class", "node")
              .attr("transform", function(d) { 
            	  return "translate(" + d.x + "," + d.y + ")"; })

            node.append("rect")
                .attr("height", function (d) { return d.dy; })
                .attr("width", sankey.nodeWidth())
                .style("fill", function (d) {
                    return d.color = color(d.name.replace(/ .*/, ""));
                })
                .style("stroke", function (d) {
                    return d3.rgb(d.color).darker(2);
                })
                .append("title")
                .text(function (d) {
                    return d.name + "\n" + format(d.value);
                });

            node.append("text")
                .attr("x", -6)
                .attr("y", function (d) { return d.dy / 2; })
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .attr("transform", null)
                .text(function (d) { return d.name; })
                .filter(function (d) { return d.x < width / 2; })
                .attr("x", 6 + sankey.nodeWidth())
                .attr("text-anchor", "start");
        }
    }
}

</script>
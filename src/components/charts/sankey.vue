<template>
    <div id="sankey" class="mt-4 align-item-center"></div>
</template>

<script>
import * as d3 from "d3";
import {d3_sankey} from '../../js/sankey.js'

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
        this.draw_sankey()
    },
    methods: {
        initialize_sankey() {
            let svg = d3.select(this.id).append("svg")
            svg.append("g").attr("id", "sankey_link_group");
        },
        draw_sankey() {
            const margin = { top: 10, right: 10, bottom: 10, left: 10 };
            const height = 600;
            const width = 900;

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
                .style("stroke-width", function(d) { return Math.max(1, d.dy); })
                .sort(function(a, b) { return b.dy - a.dy; })
        }
    }
}

</script>
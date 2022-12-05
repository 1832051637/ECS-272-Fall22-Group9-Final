<template>
    <div id="sankey" class="mt-4 align-item-center"></div>
</template>

<script>
import * as d3 from "d3";
import * as d3_sankey from "d3-sankey"

// We used an Online example as basic code to save ton of time. 
// Resources URL: https://bl.ocks.org/d3noob/102603765773940cae0e16128929c0a9

export default {
    name: "SankeyGraph",
    data() {
        return {
            id: "#sankey",
            node_min_height: 3,
            link_min_width: 3,
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
            svg.append("g").attr("id", "sankey_node_group");

        },
        draw_sankey() {
            const margin = { top: 10, right: 10, bottom: 10, left: 10 };
            const height = 500;
            const width = 900;

            let formatNumber = d3.format(",.0f"),
                format = (d) => { return formatNumber(d); },
                color = d3.scaleOrdinal(d3.schemeCategory10);
            let svg = d3.select(this.id).select("svg")
                .attr("class", "sankeyChart")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            let sankey = d3_sankey.sankey()
                .nodeWidth(36)
                .nodePadding(40)
                .size([width, height]);

            // let path = sankey.links()
            // console.log(path)
            let sankeydata = this.all_sankey_data[this.curr_date]
            // console.log(sankeydata)
            sankeydata.links.forEach(function (d, i) {
                sankeydata.links[i].source = sankeydata.nodes.map(object => object.name).indexOf(d.source);
                sankeydata.links[i].target = sankeydata.nodes.map(object => object.name).indexOf(d.target);
            });
            // console.log(sankeydata)
            let graph = sankey(sankeydata);
            // console.log(graph)
            let link = svg.select("#sankey_link_group")


            link.selectAll(".link")
                .data(graph.links)
                .join("path")
                .attr("class", "link")
                .attr("d", d3_sankey.sankeyLinkHorizontal())
                .style("stroke-width", (d) => { return d.width >= this.link_min_width ? d.width : this.link_min_width })

            link.selectAll(".link")
                .data(graph.links)
                .join("title")
                .attr("class", "link")
                .text((d) => {
                    return d.source.name + " → " +
                        d.target.name + "\n" + format(d.value);
                });

            let node = svg.select("#sankey_node_group")

            node.selectAll("rect").data(graph.nodes)
                .join("rect")
                .attr("class", "node")
                .attr("x", (d) => { return d.x0; })
                .attr("y", (d) => { return d.y0; })
                .attr("height", (d) => { return d.y1 - d.y0 >= this.node_min_height ? d.y1 - d.y0 : this.node_min_height; })
                .attr("width", sankey.nodeWidth())
                .style("fill", (d) => {
                    return d.color = color(d.name.replace(/ .*/, ""));
                })
                .style("stroke", (d) => {
                    return d3.rgb(d.color).darker(2);
                })
                .append("title")
                .text((d) => {
                    return d.name + "\n" + format(d.value);
                });

            node.selectAll("text").data(graph.nodes)
                .join("text")
                .attr("class", "node")
                .attr("x", (d) => { return d.x0 - 6; })
                .attr("y", (d) => { return (d.y1 + d.y0) / 2; })
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text((d) => { return d.name; })
                .filter((d) => { return d.x0 < width / 2; })
                .attr("x", (d) => { return d.x1 + 6; })
                .attr("text-anchor", "start")
                .style("font-size", 20)
        }
    }
}

</script>
<template>
    <div id="sankey" class="mt-4 align-item-center"></div>
</template>

<script>
import * as d3 from "d3";


export default {
    name: "SankeyGraph",
    data() {
        return {
            id: "#sankey"
        }
    },
    props: {

    },
    mounted() {
        console.log("Sankey is mounted")
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
            svg.append("g").attr("id", "sankey_group");
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
        }
    }
}

</script>
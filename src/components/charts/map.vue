<template>
    <div id="map"></div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson"
import testData from "../../assets/data/test.json"; /* Example of reading in data direct from file*/

export default {
    name: 'MapChart',
    data() {
        return {
            id: "#map",
        }
    },
    props: {
        // ---Props inherited from parent components---
        myGeoData: Object,
    },
    mounted() {
        // console.log(testData);
        // let localData = testData['data'];
        console.log("Mounted: My Main map data", this.myGeoData)
        this.initialize_map()
        this.draw_map()
    },
    methods: {
        initialize_map() {
            let svg = d3.select(this.id).append("svg")
            svg.append("g").attr("id", "map_group");
            svg.append("g").attr("id", "map_legend");
        },
        draw_map() {
            const margin = { top: 20, right: 20, bottom: 20, left: 20 };
            const height = 500 * 0.65;
            const width = 960 * 0.65;
            const unknown_color = "#949494"
            // console.log(this.id)
            let svg = d3.select(this.id).select("svg")
                .attr("class", "mapChart")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            let g = svg.select("#map_group");

            // Let's have different color...
            const color = d3.interpolateHsl("#ffa366", "#000000")

            const countries = topojson.feature(this.myGeoData, this.myGeoData.objects.countries);

            // Use regular flat projection
            const projection = d3.geoMercator()
                .scale(100)
                .translate([width / 2, height / 1.5])

            const path = d3.geoPath(projection)

            g.selectAll("path").data(countries.features)
                .join("path")
                .attr("fill", (d, i) => {
                    return unknown_color // unknown data color
                })
                .attr("class", "countries")
                .attr("d", path)
        }
    }
}

</script>


<style>

</style>
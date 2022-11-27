<template>
    <div id="map"></div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson"
import getCountryISO3 from "country-iso-2-to-3"
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
        myCumDeathData: Array,
        curr_date: String,
    },
    mounted() {
        // console.log(testData);
        // let localData = testData['data'];
        console.log("Mounted: My Main map data", this.myCumDeathData)
        this.initialize_map()
        this.draw_map()
    },
    updated() {
        console.log("Updated: My Main map data")
    },
    methods: {
        process_country_feature(features) {
            features.forEach(c => {
                c.properties.country_code = getCountryISO3(c.properties.country_code)
            });

            return features
        },
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
            const circle_radius = d3.scaleLinear()
                .domain([0, 1000000])
                .range([0.2, 40])

            const country_features = this.process_country_feature(topojson.feature(this.myGeoData, this.myGeoData.objects.countries).features);

            // Use regular flat projection
            const projection = d3.geoMercator()
                .scale(100)
                .translate([width / 2, height / 1.5])

            const path = d3.geoPath(projection)

            g.selectAll("path").data(country_features)
                .join("path")
                .attr("fill", (d, i) => {
                    return unknown_color // unknown data color
                })
                .attr("class", "countries")
                .attr("d", path)

            g.selectAll("circle").data(country_features)
                .join("circle")
                .attr("class", "mapCircle")
                .attr("r", (d) => {
                    let country_code = d.properties.country_code
                    if (!country_code) return 0
                    let target = this.myCumDeathData.find(c => c.country_code == country_code)
                    if (!target) return 0
                    console.log(target[this.curr_date])
                    return circle_radius(target[this.curr_date])
                    // return 10
                })
                .attr("transform", (d) => {
                    let lat = parseFloat(d.properties.lat)
                    let lon = parseFloat(d.properties.lon)
                    if (!lat || !lon)
                        lat = lon = -50
                    return "translate(" + projection([lon, lat]) + ")";
                });

            let zoom = d3.zoom()
                .scaleExtent([1, 12])
                .on('zoom', (event) => {
                    d3.select("#map_group")
                        .attr('transform',
                            event.transform
                        );
                });

            let reset = (event, d) => {
                if (event.target.nodeName == "path") {
                    return
                }

                // g.select("#map_" + selected_country_code)
                //     .transition()
                //     .duration(transition_duration)
                //     .style("stroke", "transparent")
                //     .style("stroke-width", origin_width)
                //     .style("opacity", "1")

                // selected_country_code = 'no country selected'
                // set_country()

                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
                );
            }
            svg.call(zoom);
            svg.on("click", reset);
        }
    }
}

</script>


<style>

</style>
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
            death_max: 1000000,
            confirmed_max: 10000000,
            display_color: {
                cum_confirmed_data: "red",
                cum_death_data: "black",
            },

        }
    },
    props: {
        // ---Props inherited from parent components---
        geo_data: Object,
        csv_data: Object,
        curr_date: String,
        today_date: String,
        display_mode: String,
    },
    mounted() {
        console.log("Mounted: My Main map data", this.csv_data[this.display_mode])

        this.initialize_map()
        this.draw_map()
    },
    updated() {
        console.log("Updated: My Main map data")
        console.log("Curr is ", this.curr_date)
        this.draw_map()
    },
    methods: {
        set_death_max() {
            this.death_max = d3.max(death_data, d => {
                // console.log(d)
                return toNumber(d[this.today_date])
            })
        },
        process_country_feature(features) {
            features.forEach(c => {
                if (!c.properties.country_code || c.properties.country_code.length == 3) return
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
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };
            const height = 400*1.2;
            const width = 630*1.2;
            const unknown_color = "green"
            // "#949494"
            let death_data = this.csv_data.cum_death_data
            let confirmed_data = this.csv_data.cum_confirmed_data

            let svg = d3.select(this.id).select("svg")
                .attr("class", "mapChart")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            let g = svg.select("#map_group");

            // Let's have different color...
            const color = d3.interpolateHsl("#969696", "#000000")

            const circle_radius = d3.scaleLinear()
                .domain([0, this.death_max])
                .range([0.2, 60])

            const country_features = this.process_country_feature(topojson.feature(this.geo_data, this.geo_data.objects.countries).features);

            // Use regular flat projection
            const projection = d3.geoMercator()
                .scale(120)
                .translate([width / 2, height / 1.5])

            const path = d3.geoPath(projection)

            g.selectAll("path").data(country_features)
                .join("path")
                .attr("fill", (d, i) => {
                    // return unknown_color // unknown data color
                    let country_code = d.properties.country_code
                    if (!country_code) return unknown_color
                    let target = confirmed_data.find(d => d.country_code == country_code)
                    if (!target || !target[this.curr_date]) return unknown_color
                    return color(toNumber(target[this.curr_date]) / this.confirmed_max)
                })
                .attr("class", "countries")
                .attr("d", path)


            g.selectAll("circle").data(country_features)
                .join("circle")
                .attr("class", "mapCircle")
                .attr("r", (d) => {
                    let country_code = d.properties.country_code
                    if (!country_code) return 0
                    let target = death_data.find(c => c.country_code == country_code && c.jurisdiction == "NAT_TOTAL")
                    if (!target) return 0
                    if (toNumber(target[this.curr_date]) < 1){
                        return 0
                    } 
                    return circle_radius(toNumber(target[this.curr_date]))
                })
                .transition()
                .attr("transform", (d) => {
                    let lat = toNumber(d.properties.lat)
                    let lon = toNumber(d.properties.lon)
                    if (!lat || !lon)
                        lat = lon = 0
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
        },
    }
}


function toNumber(item) {
    if (typeof item === 'number') {
        return item
    }
    return item ? parseFloat(item) : 0.0
}
</script>


<style>

</style>
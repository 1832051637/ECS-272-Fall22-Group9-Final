<template>
    <modal :show_modal="show_modal" :event_date="event_date" :event_msg="event_msg" @toggle="toggle_modal"/>
    <div id="map"></div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson"
import getCountryISO3 from "country-iso-2-to-3"
import modal from "./map_components/modal.vue"
// import $ from 'jquery'
// import testData from "../../assets/data/test.json"; /* Example of reading in data direct from file*/

const NOTICE_IMG_PATH = "/src/assets/images/notice_bubble.png"
const GLOBAL_IMG_PATH = "/src/assets/images/global_event.png"

export default {
    name: 'MapChart',
    emits: ['toggle_player'],
    data() {
        return {
            id: "#map",
            death_max: 1000000,
            confirmed_max: 10000000,
            display_color: {
                cum_confirmed_data: "#b1d7fc",
                cum_death_data: "red",
            },
            unknown_color: "#949494",
            curr_event_array: Array(this.csv_data.event_data.length).fill(0),
            img_size: 25,
            show_modal: false,
            event_msg: "event_msg",
            event_date: "event_date",
        }
    },
    props: {
        // ---Props inherited from parent components---
        geo_data: Object,
        csv_data: Object,
        curr_date: String,
        today_date: String,
        curr_date_index: Number,
        
        // display_mode: String,
    },
    components: {
        modal,
    },
    mounted() {
        console.log("Mounted: My Main map data", this.csv_data.event_data)

        this.initialize_map()
        this.draw_map()
    },
    updated() {
        console.log("Updated: My Main map data")
        console.log("Curr is ", this.curr_date)
        this.draw_map()
    },
    methods: {
        toggle_modal(changes) {
            this.show_modal = changes
            this.$emit("toggle_player", changes)
        },
        
        set_death_max() {
            this.death_max = d3.max(Object.values(this.csv_data.cum_death_data), d => {
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
            svg.append("image")
                .attr("id", "map_g_event")
                .attr('xlink:href', GLOBAL_IMG_PATH)
                .attr("width", "50")
                .attr("height", "50")
                .attr("x", 0)
                .attr("y", 0)
                .transition()
                .attr("display", "none")

            // Add a legend
            const interval = []
            const legend_count = 6      // Last legend will be unknown data
            const legend_width = 10
            const legend_height = 10
            const legend_coord = [20, 320]
            const legend_box_width = legend_width * 14
            const legend_box_height = legend_height * 15
            const padding = 5

            let legend_g = svg.append("g").attr("id", "map_legend_group")
                .attr("display", "none")
            legend_g.append("rect")
                .attr("id", "map_legend_box")
                .attr("x", legend_coord[0] - padding)
                .attr("y", legend_coord[1] - padding * 4)
                .attr("rx", 6)
                .attr("width", legend_box_width)
                .attr("height", legend_box_height)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", "1")

            let legend = legend_g.append("g").attr("id", "map_legend")

            // = svg.select("#map_legend")
            for (let i = 0; i < legend_count + 1; i++) {
                interval.push(i)
            }

            const color = d3.interpolateHsl(this.display_color.cum_confirmed_data, "#000000")
            const unknown_color = "#949494"
            legend.selectAll("rect").data(interval)
                .join("rect")
                .attr('width', legend_width)
                .attr('height', legend_height)
                .style('fill', d => {
                    if (d == legend_count) {
                        return unknown_color
                    }
                    return color(d / (legend_count - 1))
                })
                .attr("x", legend_coord[0] + padding)
                .attr("y", d => (padding + legend_height) * d + legend_coord[1])

            legend.append("circle")
                .attr("class", "mapCircle")
                .attr("r", legend_height)
                .attr("cx", legend_coord[0] + legend_width)
                .attr("cy", (padding + legend_height) * (legend_count + 1) + legend_height + legend_coord[1])

            legend.selectAll("text").data(interval)
                .join("text")
                .attr("x", legend_coord[0] + legend_width + padding * 2)
                .attr("y", d => (padding + legend_height) * d + legend_coord[1] + legend_height)
                .text(d => {
                    if (d == legend_count) {
                        return "Unknown"
                    }
                    return parseInt(this.confirmed_max / (legend_count - 1) * d)
                })
                .attr("font-size", "13")
                .attr("font-weight", "bold")

            legend.append("text").attr("id", "map_legend_unit")
                .attr("x", legend_coord[0] + padding)
                .attr("y", legend_coord[1] - padding)
                .text("Confirmed Cases")
                .attr("font-size", "13")
                .attr("font-weight", "bold")

            legend.append("text").attr("id", "map_legend_circle_text")
                .attr("x", legend_coord[0] + legend_width * 2 + padding)
                .attr("y", legend_coord[1] + legend_box_height - (legend_height + padding) * 2)
                .text("Deceased")
                .attr("font-size", "13")
                .attr("font-weight", "bold")
        },
        draw_map() {
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };
            const height = 400 * 1.2;
            const width = 630 * 1.2;

            let svg = d3.select(this.id).select("svg")
                .attr("class", "mapChart")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            // if ()

            let g = svg.select("#map_group");

            // Confirmed data color
            const color = d3.interpolateHsl(this.display_color.cum_confirmed_data, "#000000")

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
                    let country_code = d.properties.country_code
                    if (!country_code) return this.unknown_color
                    let target = this.csv_data.cum_confirmed_data[country_code]
                    if (!target || !target[this.curr_date]) return this.unknown_color
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
                    let target = this.csv_data.cum_death_data[country_code]
                    if (!target) return 0
                    if (toNumber(target[this.curr_date]) < 1) {
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

            let notifications = g.selectAll("image").data(this.csv_data.event_data)
                .join("image")
                // .attr("class","mapNotification")
                .attr('xlink:href', NOTICE_IMG_PATH)
                .attr("width", this.img_size)
                .attr("height", this.img_size)
                .attr("transform", (d) => {
                    let target_country = country_features.find(c => c.properties.country_code == d.country_code)
                    if (!target_country) return
                    let lat = toNumber(target_country.properties.lat)
                    let lon = toNumber(target_country.properties.lon)
                    if (!lat || !lon)
                        lat = lon = 0
                    let event_coords = projection([lon, lat])
                    event_coords[0] -= 5
                    event_coords[1] -= 20
                    return "translate(" + event_coords + ")";
                })

            notifications.transition()
                .duration(500)
                .attr("display", (d, i) => {
                    let global_event = svg.select("#map_g_event")
                    if (this.curr_date_index < d.date_index || this.curr_date_index > d.date_index + 15) {
                        this.curr_event_array[i] = 0
                        return "none"
                    }
                    else if (this.curr_date_index == d.date_index ) {
                        this.curr_event_array[i] = 1
                        console.log("This event just happenes and and will last 15 days on map", d)
                        if (d.country_code == "G")
                            global_event.transition().attr("display", "block")

                        return d.country_code == "G" ? "none" : "block"
                    }
                    else if (this.curr_date_index < d.date_index + 15 && this.curr_date_index > d.date_index
                        && this.curr_event_array[i]) {
                        if (i < this.csv_data.event_data.length
                            && this.csv_data.event_data[i + 1].date_index == this.curr_date_index + 1
                            && d.country_code == this.csv_data.event_data[i + 1].country_code) {
                            this.curr_event_array[i] = 0
                            if (d.country_code == "G")
                                global_event.transition().attr("display", "none")
                            return "none"
                        }
                        return d.country_code == "G" ? "none" : "block"
                    }
                    this.curr_event_array[i] = 0
                    if (d.country_code == "G")
                        global_event.transition().attr("display", "none")
                    return "none"
                })

            const img_size = this.img_size
            notifications.on("mouseover", function (e) {
                d3.select(this).transition().attr("width", img_size * 1.5).attr("height", img_size * 1.5)
            }).on("mouseleave", function (e) {
                d3.select(this).transition().attr("width", img_size).attr("height", img_size)
            }).on("click",  (e, d)=> {
                // d3.select(this).transition().attr("width", img_size).attr("height", img_size)
                // console.log(e, d)
                this.show_modal = true
                this.event_date = d.Date
                this.event_msg = d.Event
                // $('#exampleModalCenter').modal()
            })
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
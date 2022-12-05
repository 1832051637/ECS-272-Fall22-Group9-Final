<template>
    <modal :show_modal="show_modal" :event_date="event_date" :event_msg="event_msg" @toggle="toggle_modal" />
    <div id="map" class=" align-item-center  mt-3"></div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson"
import getCountryISO3 from "country-iso-2-to-3"
import modal from "./map_components/modal.vue"

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
            curr_global_event: undefined,
            img_size: 30,
            show_modal: false,
            event_msg: "event_msg",
            event_date: "event_date",
            legend_drawed: false,
            evented_countries: {},
        }
    },
    props: {
        // ---Props inherited from parent components---
        geo_data: Object,
        csv_data: Object,
        curr_date: String,
        today_date: String,
        curr_date_index: Number,
    },
    components: {
        modal,
    },
    created() {
        console.log("Created: My Main map data")
        this.set_evented_countries()
        this.set_death_max()
    },
    mounted() {
        console.log("Mounted: My Main map data")
        this.initialize_map()
        this.draw_map()
    },
    updated() {
        console.log("Updated: My Main map data")
        console.log("Curr is ", this.curr_date)
        this.draw_map()
    },
    methods: {
        get_country_event(country_code) {
            return this.evented_countries[country_code]
        },
        set_country_evented(country_code, event_index) {
            this.evented_countries[country_code].push(event_index)
        },
        set_country_unevented(country_code, event_index) {
            let array = this.evented_countries[country_code]
            let index = array.indexOf(event_index);
            if (index !== -1) {
                array.splice(index, 1);
            }
        },
        // Get all countries with event
        set_evented_countries() {
            Object.values(this.csv_data.event_data).forEach(day => {
                day.forEach(event => {
                    this.evented_countries[event["country_code"]] = []
                });
            });
        },
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

            d3.select(this.id).append("div")
                .attr("id", "map_mouse_handler")
                .style("position", "absolute")

            svg.append("image")
                .attr("id", "map_g_event")
                .attr('xlink:href', GLOBAL_IMG_PATH)
                .attr("width", this.img_size * 2)
                .attr("height", this.img_size * 2)
                .attr("x", 0)
                .attr("y", 0)
                .attr("display", "none")

            // Add a legend
            svg.append("g").attr("id", "map_legend_group")
                .attr("opacity", 0)
        },
        draw_legend(legend_g) {
            if (this.legend_drawed) return
            legend_g.transition().duration(1000).attr("opacity", 1)
            const interval = []
            const legend_count = 6      // Last legend will be unknown data
            const legend_width = 10
            const legend_height = 10
            const legend_coord = [20, 320]
            const legend_box_width = legend_width * 15
            const legend_box_height = legend_height * 18
            const padding = 6.5
            const legend_font_size = 15
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
                .attr("font-size", legend_font_size)
                .attr("font-weight", "bold")

            legend.append("text").attr("id", "map_legend_unit")
                .attr("x", legend_coord[0] + padding)
                .attr("y", legend_coord[1] - padding)
                .text("Confirmed Cases")
                .attr("font-size", legend_font_size)
                .attr("font-weight", "bold")

            legend.append("text").attr("id", "map_legend_circle_text")
                .attr("x", legend_coord[0] + legend_width * 2 + padding)
                .attr("y", legend_coord[1] + (legend_height + padding) * 8)
                .text("Deceased")
                .attr("font-size", legend_font_size)
                .attr("font-weight", "bold")
        },
        draw_map() {
            const margin = { top: 0, right: 0, bottom: 0, left: 0 };
            const height = 400 * 1.3;
            const width = 630 * 1.35;

            const curr_date = this.curr_date
            const death_data = this.csv_data.cum_death_data
            const confirmed_data = this.csv_data.cum_confirmed_data

            let svg = d3.select(this.id).select("svg")
                .attr("class", "mapChart")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            let map = svg.select("#map_group");
            let legend_group = svg.select("#map_legend_group")

            if (this.curr_date_index > 100) {
                // legend_group
                this.draw_legend(legend_group)
                this.legend_drawed = true
            }

            // Confirmed data color
            const color = d3.interpolateHsl(this.display_color.cum_confirmed_data, "#000000")
            const radius_max = 90
            const circle_radius = d3.scaleLinear()
                .domain([0, this.death_max])
                .range([0.2, radius_max])

            const country_features = this.process_country_feature(topojson.feature(this.geo_data, this.geo_data.objects.countries).features);

            // Use regular flat projection
            const projection = d3.geoMercator()
                .scale(136)
                .translate([width / 2, height / 1.5])

            const path = d3.geoPath(projection)


            const map_mouse_handler = d3.select("#map_mouse_handler")
                .attr("class", "tooltip")
                .style('font-size', '12px')

            let mouse_over = function (event, d) {
                let country_code = d.properties.country_code
                let country_name = d.properties.name
                let confirmed_cases = (confirmed_data[country_code]) ? confirmed_data[country_code][curr_date] : "Unknown"
                let deceased = (death_data[country_code]) ? death_data[country_code][curr_date] : "Unknown"
                map_mouse_handler
                    .html("<span><b>" + country_name + "</b><br>" +
                        "<b>Confirmed: </b>" + confirmed_cases + "<br>" +
                        "<b>Deceased: </b>" + deceased + "</span>")
                    .transition()
                    .duration(500)
                    .style("opacity", 1)

                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("opacity", 0.5)
                    .style("stroke-width", "0.6px")
                    .style("stroke", "black")
            }
            let mouse_move = function (event, d) {
                map_mouse_handler
                    .style("left", (event.offsetX) + 260 + "px")
                    .style("top", (event.offsetY) + 80+ "px")
            }

            let mouse_out = function (event, d) {
                map_mouse_handler
                    .style("opacity", 0)
                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
                    .style("stroke-width", "0.3px")
                    .style("stroke", "white")
            }

            map.selectAll("path").data(country_features)
                .join("path")
                .attr("fill", (d, i) => {
                    let country_code = d.properties.country_code
                    if (!country_code) return this.unknown_color
                    let target = confirmed_data[country_code]
                    if (!target || !target[this.curr_date]) return this.unknown_color
                    return color(toNumber(target[this.curr_date]) / this.confirmed_max)
                })
                .attr("class", "countries")
                .attr("d", path)
                .on("mouseover", mouse_over)
                .on("mousemove", mouse_move)
                .on("mouseout", mouse_out)

            map.selectAll("circle").data(country_features)
                .join("circle")
                .attr("class", "mapCircle")
                .attr("r", (d) => {
                    let country_code = d.properties.country_code
                    if (!country_code) return 0
                    let target = death_data[country_code]
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

            // Only one global event in one day
            let global_event = svg.select("#map_g_event")
            let curr_global_event = this.csv_data.global_event_data[this.curr_date_index]
            let tomorrow_event = this.csv_data.global_event_data[this.curr_date_index + 1]
            if (tomorrow_event && tomorrow_event["date_index"] == toNumber(global_event.attr("date_index")) + 1)
                global_event.attr("display", "none")

            if (curr_global_event) {
                this.curr_global_event = curr_global_event
                global_event.transition()
                    .attr("display", "block")
                    .attr("event_index", curr_global_event["event_index"])
                    .attr("date_index", curr_global_event["date_index"])

            } else {
                if (this.curr_date_index - toNumber(global_event.attr("date_index")) > 15 || this.curr_date_index < toNumber(global_event.attr("date_index"))) {
                    // If this global event has passed 15 days
                    global_event
                        .attr("display", "none")
                        .transition()
                        .attr("opcaity", 0)
                }
            }

            global_event.on("mouseover", (e) => {
                global_event.transition().attr("opacity", 0.5).attr("width", img_size * 2 * 1.5).attr("height", img_size * 2 * 1.5)
            }).on("mouseout", (e) => {
                global_event.transition().attr("opacity", 1).attr("width", img_size * 2).attr("height", img_size * 2)
            }).on("click", (e) => {
                this.show_modal = true
                this.event_date = this.curr_global_event.Date
                this.event_msg = this.curr_global_event.Event
            })

            const curr_date_index = this.curr_date_index
            const img_size = this.img_size
            let set_country_unevented = this.set_country_unevented
            let get_country_event = this.get_country_event

            // Append new event at that day
            this.csv_data.event_data[this.curr_date_index].forEach((e, i) => {
                if (get_country_event(e["country_code"]).at(-1) == e["event_index"])
                    return
                console.log("this day has new event: ", e)
                map.append("image")
                    .attr("class", "map_local_event")
                    .attr("date_index", e["date_index"])
                    .attr("event_index", e["event_index"])
                    .attr("country_code", e["country_code"])
                    .attr('xlink:href', NOTICE_IMG_PATH)
                    .attr("width", this.img_size)
                    .attr("height", this.img_size)
                    .attr("transform", () => {
                        let target_country = country_features.find(c => c.properties.country_code == e.country_code)
                        if (!target_country) return
                        let lat = toNumber(target_country.properties.lat)
                        let lon = toNumber(target_country.properties.lon)
                        if (!lat || !lon)
                            lat = lon = 0
                        let event_coords = projection([lon, lat])
                        event_coords[0] -= this.img_size * 0.05
                        event_coords[1] -= this.img_size * 0.9
                        return "translate(" + event_coords + ")";
                    })
                    .on("mouseover", function (e, d) {
                        d3.select(this).transition().attr("width", img_size * 1.5).attr("height", img_size * 1.5).attr("opacity", 0.5)
                    }).on("mouseout", function (e, d) {
                        d3.select(this).transition().attr("width", img_size).attr("height", img_size).attr("opacity", 1)
                    }).on("click", () => {
                        this.show_modal = true
                        this.event_date = this.str_to_date(e.Date).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })
                        this.event_msg = e.Event
                    }).transition()
                    .attr("display", "block")

                this.set_country_evented(e["country_code"], toNumber(e["event_index"]))
            });
            map.selectAll(".map_local_event")
                .each(function () {

                    let local_event = d3.select(this)
                    let local_country_code = local_event.attr("country_code")
                    let local_date_index = toNumber(local_event.attr("date_index"))
                    let local_event_index = toNumber(local_event.attr("event_index"))
                    console.log(local_date_index, local_country_code)
                    if (curr_date_index < local_date_index || curr_date_index - local_date_index > 15) {
                        // Never display future local events OR
                        // Dont display events more than 15 days before current day
                        local_event.attr("display", "none")

                        set_country_unevented(local_country_code, local_event_index)
                    } else {
                        if (local_event_index == get_country_event(local_country_code).at(-1)) {
                            console.log("this is just the current event")
                            return //If it is itself
                        }
                        if (get_country_event(local_country_code).at(-1) != local_event_index) {
                            // if it is already occupied
                            local_event.attr("display", "none")
                            set_country_unevented(local_country_code, local_event_index)
                        }
                    }
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
                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
                );
            }
            svg.call(zoom);
            svg.on("click", reset);
        },
        // date_Str: format like "01Apr2020"
        // return a Javascript Date object
        str_to_date(date_str) {
            if (!date_str) {
                return "error date"
            }
            const day = date_str.substring(0, 2)
            const month = date_str.substring(2, 5)
            const year = date_str.substring(5, 9)
            let date = new Date(day + " " + month + " " + year)
            return date
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
<template>

    <section class="fadeIn">
        <div class="row wrap size-100 ">
            <div class="col-3">
                <h1 class="display-2"><strong>How are vaccines administered?</strong></h1>
                <!-- <h2>Still, not everyone has been vaccinated</h2> -->
            </div>
            <div class="col-9">
                <div class="row">
                    <div class="col"><input type="range" v-bind:min="0" v-bind:max="date_array.length - 1"
                        class="slider mt-3 mx-0" id="sankey_date_slider" v-model.number="curr_date_index"></div>
                    <div class="col-md-auto"><h2><b>Date: {{date_array[curr_date_index]}}</b></h2></div>
                </div>
                <div class="row">
                    <SankeyGraph v-if="data_exists" :all_sankey_data="all_sankey_data"
                        :curr_date="date_array[curr_date_index]" />
                </div>

            </div>
        </div>
    </section>
</template>

<script>
import SankeyGraph from '../charts/sankey.vue';
import * as d3 from 'd3'

const CSV_PATH = "https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/global_data/archive/time_series_covid19_vaccine_global.csv"
export default {
    name: "slide3",
    data() {
        return {
            data_exists: false,
            date_array: [],
            all_sankey_data: {},
            max_country: 5,
            curr_date_index: 0,
            curr_date: "2020-12-28"
        }
    },
    components: {
        SankeyGraph,
    },
    created() {
        console.log("slide2 is created")
        this.read_csv()
    },
    updated() {

    },
    methods: {
        read_csv() {
            d3.csv(CSV_PATH).then((data) => {
                // console.log(data)
                this.process_date_array(data)
                // console.log(this.date_array)
                let processed_data = this.get_processed_csv_data(data)
                // console.log(processed_data)
                this.process_all_sankey_data(processed_data)
                console.log(this.all_sankey_data)
                this.data_exists = true
            })
        },
        process_date_array(data) {
            data.forEach(element => {
                if (element["Country_Region"] == "World") {
                    this.date_array.push(element["Date"])
                }
            });
        },
        get_processed_csv_data(data) {
            let temp = {}
            let processed_csv = {}
            this.date_array.forEach(day => {
                temp[day] = []
            })
            data.forEach(element => {
                if (element["Province_State"] != "") return
                if (element["Country_Region"] == "US (Aggregate)") return
                element["Doses_admin"] = toNumber(element["Doses_admin"])
                if (element["Doses_admin"] == 0) return
                element["People_partially_vaccinated"] = toNumber(element["People_partially_vaccinated"])
                element["People_fully_vaccinated"] = toNumber(element["People_fully_vaccinated"])
                let ungiven_num = element["Doses_admin"] - element["People_partially_vaccinated"] - element["People_fully_vaccinated"] * 2
                element["Ungiven"] = ungiven_num >= 0 ? ungiven_num : 0
                temp[element["Date"]].push(element)
            });

            Object.values(temp).forEach(day_data => {
                let date = day_data[0]["Date"]
                day_data.sort((a, b) => {
                    return b["Doses_admin"] - a["Doses_admin"]
                })
                // console.log(day_data)
                if (day_data.length > this.max_country + 2) {
                    let others = {}
                    let doses_adm_sum = 0
                    let partially_sum = 0
                    let fully_sum = 0
                    day_data.slice(this.max_country + 2).forEach(d => {
                        doses_adm_sum += d["Doses_admin"]
                        partially_sum += d["People_partially_vaccinated"]
                        fully_sum += d["People_fully_vaccinated"]
                    })
                    others["Country_Region"] = "Others"
                    others["Date"] = date
                    others["Doses_admin"] = doses_adm_sum
                    others["People_partially_vaccinated"] = partially_sum
                    others["People_fully_vaccinated"] = fully_sum
                    let ungiven = doses_adm_sum - partially_sum - fully_sum * 2
                    others["Ungiven"] = ungiven >= 0 ? ungiven : 0
                    day_data = day_data.slice(0, this.max_country + 1)
                    day_data.push(others)
                }
                processed_csv[date] = day_data
            })
            return processed_csv
        },
        process_all_sankey_data(processed_csv) {
            this.date_array.forEach(day => {
                let graph = {
                    "date": day,
                    "nodes": [],
                    "links": []
                };
                graph.nodes.push({ "name": "World Doses Admin" })
                // console.log(processed_csv[day])
                processed_csv[day].forEach(region => {
                    if (day == "2020-12-14")
                        console.log(region)
                    if (region["Country_Region"] == "World") {
                        graph.nodes.push({ "name": "Partially vaccinated" })
                        graph.nodes.push({ "name": "Fully vaccinated" })
                        graph.nodes.push({ "name": "Ungiven Doses" })
                        return
                    }
                    graph.nodes.push({
                        "name": region["Country_Region"] + " Doses Admin"
                    })
                    graph.links.push({
                        "source": "World Doses Admin",
                        "target": region["Country_Region"] + " Doses Admin",
                        "value": region["Doses_admin"]
                    })
                    graph.links.push({
                        "source": region["Country_Region"] + " Doses Admin",
                        "target": "Partially vaccinated",
                        "value": region["People_partially_vaccinated"]
                    })
                    graph.links.push({
                        "source": region["Country_Region"] + " Doses Admin",
                        "target": "Fully vaccinated",
                        "value": region["People_fully_vaccinated"]
                    })
                    graph.links.push({
                        "source": region["Country_Region"] + " Doses Admin",
                        "target": "Ungiven Doses",
                        "value": region["Ungiven"]
                    })

                })
                this.all_sankey_data[day] = graph
            });
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
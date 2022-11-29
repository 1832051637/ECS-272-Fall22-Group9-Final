<template>
  <section>
    <!--.wrap = container (width: 90%) -->
    <div class="wrap size-50 aligncenter">
      <h2><strong>Why WebSlides?</strong></h2>
      <p class="text-intro"><a href="demos/why-webslides.html" title="Why WebSlides?">Presentations</a>, <a
          href="demos/landings.html" title="Landings">landings</a>, <a href="demos/portfolios.html"
          title="Portfolios">portfolios</a>, and <a href="demos/longforms.html" title="Longforms">longforms</a>.</p>
      <!-- <div class="bg-white shadow">
            <ul class="flexblock reasons">
              <li>
                <h2>An opportunity to engage.</h2>
                <p>WebSlides is about good karma. This is about telling the story, and sharing it in a beautiful way.
                  HTML and CSS as narrative elements.</p>
              </li>
              <li>
                <h2>Work better, faster.</h2>
                <p>Designers, marketers, and journalists can now focus on the content. Simply <a href="demos/index.html"
                    title="WebSlides Demos">choose a demo</a> and customize it in minutes.</p>
              </li>
            </ul>
          </div> -->

      <!-- <BarChart/> -->
      <select v-model="display_mode">
        <option disabled value="">Please select a data type to view</option>
        <option>cum_confirmed_data</option>
        <option>cum_death_data</option>
      </select>
      <select v-model="curr_date">
        <option disabled value="">Please select a date</option>
        <option>01Apr2020</option>
        <option>01Apr2021</option>
        <option>01Apr2022</option>
      </select>
      <MapChart v-if="!fetching && geo_data_exists && cum_death_data_exists && cum_confirmed_data_exists"
        :geo_data="geo_data" :csv_data="csv_data" :curr_date="curr_date" :display_mode="display_mode"
        :today_date="today_date" />

      <!-- .end .bg-white shadow -->
    </div>
    <!-- .end .wrap -->
  </section>
</template>

<script>
import * as d3 from "d3";
import BarChart from "../charts/barchart.vue"
import MapChart from "../charts/map.vue"
import geo_data from '../../assets/data/world_topo.json'

const TIME_SERIES_CUM_DEATH = "https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/master/data/timeseries/confirmed_deaths.csv"
const TIME_SERIES_CUM_CONFIRMED = "https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/master/data/timeseries/confirmed_cases.csv"

const CONFIRMED_MODE = "cum_confirmed_data"
const DEATH_MODE = "cum_death_data"


export default {
  name: "slide2",
  data() {
    return {
      playing: true,
      fetching: true,
      geo_data_exists: false,
      cum_death_data_exists: false,
      cum_confirmed_data_exists: false,
      csv_data: { cum_death_data: [], cum_confirmed_data: [] },
      geo_data: {},
      date_array: [],
      first_date: "01Jan2020",
      second_date: "02Jan2020",
      curr_date: "01Apr2020",
      today_date: "",
      display_mode: CONFIRMED_MODE,
    }
  },

  components: {
    BarChart,
    MapChart
  },
  created() {
    console.log("slide2 is created")
    this.set_today_date()
    this.set_date_array()
    this.read_geojson()
    this.read_cum_death()
    this.read_cum_confirmed()
    this.fetching = false   // Data has been loaded

    // console.log(this.csv_data["cum_confirmed_data"])
  },
  mounted() {
    console.log("slide2 is mounted")
    // this.tempGeoData = this.geo_data
  },
  updated() {
    console.log("slide2 is updated")
  },
  methods: {
    // date: a Javascript Date object
    // Return a string date for CSV data
    date_to_str(date) {
      const day = date.toLocaleString('en-US', { day: 'numeric' });
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.toLocaleString('en-US', { year: 'numeric' });
      if (day.length < 2) {
        return "0" + day + month + year
      }
      return day + month + year
    },
    set_today_date() {
      const date = new Date();  // 2009-11-10
      date.setDate(date.getDate() - 1)
      this.date_to_str(date)
      console.log("Today is " + this.date_to_str(date));
      this.today_date = this.date_to_str(date)
    },

    // date_Str: format like "01Apr2020"
    // return a Javascript Date object
    str_to_date(date_str) {
      const day = date_str.substring(0, 2)
      const month = date_str.substring(2, 5)
      const year = date_str.substring(5, 9)
      let date = new Date(day + " " + month + " " + year)
      return date
    },
    set_date_array() {
      const begin = this.str_to_date(this.first_date)
      const today = this.str_to_date(this.today_date)
      let curr = new Date(begin)
      while (curr <= today) {
        this.date_array.push(this.date_to_str(curr))

        let next = curr.setDate(curr.getDate() + 1);
        curr = new Date(next);
      }
      console.log("Array of all date...", this.date_array)

    },
    process_csv_data(data) {
      data.forEach((c, index) => {

        this[index] = this.process_one_line_csv(c)
        // this[index] = c
      }, data);

      return data
    },

    process_one_line_csv(line) {

      // const second = this.str_to_date(this.date_array[1])
      // const today = this.str_to_date(this.today_date)

      line[this.first_date] = this.date_array[0] // Modify the first date

      let yesterday_data = line[this.first_date]

      // let curr = new Date(second)

      for (let i = 1; i < this.date_array.length; i++) {
        const today_str = this.date_array[i];
        if (line[today_str]  == "" || line[today_str]  === undefined) {
          line[today_str] = yesterday_data
        }
        yesterday_data = line[today_str]
      } 
      // {
      //   let today_data = line[this.date_to_str(curr)]
      //   // console.log("Today is ", curr)
      //   // console.log("today data is: ", today_data)
      //   // console.log("Yesterday data is: ", yesterday_data)
      //   if (today_data == "" || today_data === undefined) {
      //     line[this.date_to_str(curr)] = yesterday_data
      //     today_data = yesterday_data
      //     // console.log("Today data has been set to yesterday: ", line[this.date_to_str(curr)])
      //   }
      //   yesterday_data = today_data
      //   let next = curr.setDate(curr.getDate() + 1);
      //   curr = new Date(next);
      // }
      return line
    },
    update_date() {
      if (!playing) return
      for (let i = 0; i < array.length; i++) {
        const element = array[i];

      }
    },
    read_geojson() {
      if (!geo_data) {
        console.log("geo_data not found")
        return
      }
      this.geo_data_exists = true;
      this.geo_data = geo_data
    },
    read_cum_death() {
      //async method
      d3.csv(TIME_SERIES_CUM_DEATH)
        .then((data) => {
          this.cum_death_data_exists = true
          this.csv_data.cum_death_data = this.process_csv_data(data)
          let target = this.csv_data.cum_death_data.find(d => d.country_code == "USA")
        });


    },
    read_cum_confirmed() {
      //async method
      d3.csv(TIME_SERIES_CUM_CONFIRMED)
        .then((data) => {
          this.cum_confirmed_data_exists = true
          this.csv_data.cum_confirmed_data = this.process_csv_data(data)
        });
    },


  },

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
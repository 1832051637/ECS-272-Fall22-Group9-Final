<template>
  <section class="fullscreen slide-top">
    <!--.wrap = container (width: 90%) -->
    <div class="container-fluid text-center">
      <h1 class="display-1"><strong>What happened to our earth?</strong></h1>
      <div class="row align-items-center ">
        <div class="col-3  d-flex flex-row-reverse">
          <div class="row">
            <div class="col-auto">
              <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  Play speed: {{ play_speed_mode }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" role="menu">
                  <li v-for="option in Object.keys(play_speed)" :key="option">
                    <a class="dropdown-item" @click="play_speed_mode = option">{{ option }}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-auto">
              <button class="btn btn-outline-primary btn-lg mr-0" @click="pause" v-if="is_playing">Pause</button>
              <button class="btn btn-outline-primary btn-lg mr-0" @click="play" v-if="!is_playing">Play</button>
            </div>
          </div>
        </div>
        <div class="col-6">
              <input type="range" v-bind:min="0" v-bind:max="date_array.length - 1" class="slider mt-3 mx-0"
                id="date_slider" v-model.number="curr_date_index">
            </div>
        <div class="col-3 d-flex flex-row">
          <h2><b>Date: {{
              str_to_date(date_array[parseFloat(curr_date_index)]).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day:
                  'numeric'
              })
          }}</b></h2>
        </div>
      </div>

      <MapChart v-if="is_all_data_ready" :geo_data="geo_data" :csv_data="csv_data"
        :curr_date="date_array[curr_date_index]" :curr_date_index="curr_date_index" :today_date="today_date"
        @toggle_player="toggle_player" />
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
const EVENTS_DATA = window.location.origin + "/src/assets/data/events.csv"


const CONFIRMED_MODE = "cum_confirmed_data"
const DEATH_MODE = "cum_death_data"


export default {
  name: "slide2",
  data() {
    return {
      fetching: true,
      geo_data_exists: false,
      cum_death_data_exists: false,
      cum_confirmed_data_exists: false,
      event_data_exisited: false,
      csv_data: { cum_death_data: {}, cum_confirmed_data: {}, event_data: {}, global_event_data: {}, },
      geo_data: {},
      date_array: [],
      first_date: "31Dec2019",
      curr_date_index: 0,
      today_date: "",
      is_playing: false,
      play_speed_mode: "normal",
      play_speed: {
        fast: 20,
        normal: 300,
        slow: 1000,
      },
      timer: NaN,
      modal_interupt: false,  // When a modal is opened and player is playing
    }
  },

  components: {
    BarChart,
    MapChart
  },
  created() {
    console.log("slide2 is created at ", window.location.origin)
    this.set_today_date()
    this.set_date_array()
    this.read_geojson()
    this.read_cum_death()
    this.read_cum_confirmed()
    this.read_events()
    this.fetching = false   // Data has been loaded
  },
  mounted() {
    console.log("slide2 is mounted")
    window.addEventListener('wheel', this.handle_wheel);
  },
  updated() {
    console.log("slide2 is updated")
    this.reset_timer()
    if (this.date_array[this.curr_date_index] == this.today_date) {
      this.pause()
    }
  },
  destroyed() {
    console.log("slide2 is destroyed")
    window.removeEventListener('wheel', this.handle_wheel);
  },
  computed: {
    is_all_data_ready() {
      return (!this.fetching && this.geo_data_exists && this.cum_death_data_exists && this.cum_confirmed_data_exists && this.event_data_exisited)
    },
  },
  methods: {
    toggle_player(modal_open) {
      if (modal_open && this.is_playing) {
        console.log("Model is open so player stopped")
        this.modal_interupt = true
        this.pause()
        return
      } else if (!modal_open && this.modal_interupt) {
        console.log("Model is closed so playing continued")
        this.play()
      }
      this.modal_interupt = false

    },
    handle_wheel() {
      this.pause()
    },
    reset_timer() {
      if (!this.is_playing) return
      clearInterval(this.timer)
      this.timer = setInterval(this.go_next_day, this.play_speed[this.play_speed_mode])
    },
    play() {
      this.is_playing = true
      this.timer = setInterval(this.go_next_day, this.play_speed[this.play_speed_mode])
    },
    pause() {
      if (!this.is_playing) return
      this.is_playing = false
      clearInterval(this.timer)
      console.log("*******The player has been paused!********")
    },
    // date: a Javascript Date object
    // Return a string date for CSV data
    date_to_str(date) {
      if (!date) {
        return "error date"
      }
      const day = date.toLocaleString('en-US', { day: 'numeric' });
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.toLocaleString('en-US', { year: 'numeric' });
      if (day.length < 2) {
        return "0" + day + month + year
      }
      return day + month + year
    },
    set_today_date() {
      const date = new Date();
      date.setDate(date.getDate() - 1)
      this.date_to_str(date)
      console.log("Today is " + this.date_to_str(date));
      this.today_date = this.date_to_str(date)
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
      let processed_data = []
      data.forEach((c) => {
        if (c.jurisdiction != "NAT_TOTAL")
          return
        processed_data.push(this.process_one_line_csv(c))
      });

      return processed_data
    },

    process_one_line_csv(line) {
      line[this.first_date] = String(toNumber(line[this.first_date])) // Modify the first date

      let yesterday_data = line[this.first_date]
      for (let i = 1; i < this.date_array.length; i++) {
        const today_str = this.date_array[i];
        if (line[today_str] == "" || line[today_str] === undefined)
          line[today_str] = yesterday_data
        yesterday_data = line[today_str]
      }
      return line
    },

    array_to_obj(array, key) {
      let rt = {}
      array.forEach(element => {
        rt[element[key]] = element
      });
      return rt
    },
    go_next_day() {
      if (this.date_array[this.curr_date_index] == this.today_date) {
        this.is_playing = false
        return
      }
      this.curr_date_index += 1
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
          this.csv_data.cum_death_data = this.array_to_obj(this.process_csv_data(data), "country_code")
        });
    },
    read_cum_confirmed() {
      //async method
      d3.csv(TIME_SERIES_CUM_CONFIRMED)
        .then((data) => {
          this.cum_confirmed_data_exists = true
          this.csv_data.cum_confirmed_data = this.array_to_obj(this.process_csv_data(data), "country_code")
        });
    },
    read_events() {
      d3.csv(EVENTS_DATA)
        .then((data) => {
          this.event_data_exisited = true
          let event_array = []
          let global_event_array = []
          data.forEach((event, i) => {
            if (event.country_code) {
              let converted_date_str = this.date_to_str(new Date(event.Date))
              event.Date = converted_date_str
              event["date_index"] = this.date_array.findIndex(d => d == event.Date)
              if (event.country_code != "G") {

                // event["event_index"] = i
                event_array.push(event)
              } else {
                global_event_array.push(event)
              }
            }
          });
          this.date_array.forEach((day, i) => {
            this.csv_data.event_data[i] = []
            event_array.forEach((e, j) => {
              if (day == e.Date) {
                e["event_index"] = j
                this.csv_data.event_data[i].push(e)
              }
            })

          });
          // this.csv_data.event_data = event_array

          global_event_array.forEach((g, k) => {
            g["event_index"] = k
            this.csv_data.global_event_data[g["date_index"]] = g
          })
          console.log(this.csv_data.global_event_data)
        })
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
<template>
  <section class="fullscreen slide-top py-4">
    <div class="container-fluid text-center">
      <h1 class="display-1"><b>What about our economy?</b></h1>
      <h1><strong>And how did we respond to it?</strong></h1>
      <div class="row align-items-center">
        <div class="col">
          <button class="btn btn-outline-primary btn-lg mr-0" @click="pause" v-if="is_playing">Pause</button>
          <button class="btn btn-outline-primary btn-lg mr-0" @click="play" v-if="!is_playing">Play</button>
        </div>
        <div class="col-6">
          <input type="range" v-bind:min="0" v-bind:max="date_array.length-1" class="slider mt-3 mx-0"
                id="bubble_date_slider" v-model.number="curr_date_index">
        </div>
        <div class="col-3 d-flex flex-row">
          <h2><b>Date: {{change_date_format(curr_date_index)}}</b></h2>
        </div>
      </div>
      <BubbleChart
        v-if="is_data_ready"
        :mycpiData="mycpiData"
        :mygovData="mygovData"
        :myrateData="myrateData"
        :curr_date_index="curr_date_index"
      />
    </div>
  </section>
</template>

<script>
import * as d3 from "d3";
import BubbleChart from "../charts/bubblechart.vue";

const CPI_DATA = window.location.origin + "/src/assets/data/cpi_data.csv";
const GOV_DATA = window.location.origin + "/src/assets/data/gov_data.csv";
const RATE_DATA =
  window.location.origin + "/src/assets/data/confirmed_rate_data.csv";

export default {
  name: "slide4",
  data() {
    return {
      cpi_data_exists: false,
      gov_data_exists: false,
      rate_data_exists: false,
      mycpiData: [],
      mygovData: [],
      myrateData: [],
      curr_date_index: 0,
      date_array: [],
      is_playing: false,
      timer: null,
      play_speed: 700,
    };
  },
  components: {
    BubbleChart,
  },
  created() {
    /* Fetch via Path */
    this.drawcpiFromCsv();
    this.drawgovFromCsv();
    this.drawrateFromCsv();
    this.set_date_array();
  },
  computed: {
    is_data_ready() {
      return (
        this.cpi_data_exists && this.gov_data_exists && this.rate_data_exists
      );
    },
  },
  mounted() {
    console.log("slide4 is mounted");
  },
  updated() {
    console.log("slide4 is updated");
    this.reset_timer();
    if (this.curr_date_index == (this.date_array.length-1)) {this.pause()};
  },
  methods: {
    reset_timer() {
      if(!this.is_playing) return;
      clearInterval(this.timer);
      this.timer = setInterval(this.go_next_month, this.play_speed);
    },
    play() {
      this.is_playing = true;
      this.timer = setInterval(this.go_next_month, this.play_speed);
    },
    pause() {
      if(!this.is_playing) return;
      this.is_playing = false;
      clearInterval(this.timer);
    },
    go_next_month() {
      if (this.curr_date_index == (this.date_array.length-1)) {
        this.is_playing = false;
        return
      }
      this.curr_date_index += 1;
    },
    set_date_array() {
      for (var i=2; i < 13; i++){
        this.date_array.push("2020-"+String(i))
      };
      for (var i=1; i < 13; i++){
        this.date_array.push("2021-"+String(i))
      };
      for (var i=1; i < 11; i++){
        this.date_array.push("2022-"+String(i))
      }
      console.log("Date array for bubble", this.date_array);
    },
    // date_Str: format like "Apr2020"
    // return a Javascript Date object
    change_date_format(index) {
      if (!index) {
        index = 0;
      };
      var date_string = this.date_array[index];
      const month_list = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      let date = "";
      if (date_string.length == 6){
        date = month_list[parseInt(date_string.substring(5))-1]+date_string.substring(0,4);
      }else{ date = month_list[parseInt(date_string.substring(5,7))-1]+date_string.substring(0,4); 
      }
      return date
    },

    drawcpiFromCsv() {
      //async method
      d3.csv(CPI_DATA).then((data) => {
        // array of objects
        // console.log(data.length);
        // console.log(data);
        this.mycpiData = data;
        this.cpi_data_exists = true;
      });
    },
    drawgovFromCsv() {
      //async method
      d3.csv(GOV_DATA).then((data) => {
        // array of objects
        // console.log(data.length);
        // console.log(data);
        this.mygovData = data;
        this.gov_data_exists = true;
      });
    },
    drawrateFromCsv() {
      //async method
      d3.csv(RATE_DATA).then((data) => {
        // array of objects
        // console.log(data.length);
        // console.log(data);
        this.myrateData = data;
        this.rate_data_exists = true;
      });
    },
  },
};

</script>

<style>
</style>
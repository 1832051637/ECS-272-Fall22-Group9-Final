<template>
    <section class="fullscreen">
      <!-- <div class="col-6 pl-0">
        <input type="range" v-bind:min="0" v-bind:max="date_list.length - 1" class="slider mt-3 mx-0"
          id="date_slider_bubble" v-model:value="date" v-for="item in date_list">
      </div>
      <div class="col-3">
        <h2><b>Date: {{
          str_to_date(date_array[parseFloat(curr_date_index)]).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day:
              'numeric'
          })
        }}</b></h2> -->
      <div class="flexblock features">
        <BubbleChart v-if="is_data_ready" :mycpiData="mycpiData" :mygovData="mygovData" :myrateData="myrateData" :current_date="current_date"/>
          <!-- <h2>Features</h2>
          <ul class="flexblock features">
            <li>
              <div>
                <h2>
                  <span>&rarr;</span>
                  Simple Navigation
                </h2>
                with arrow keys, presenter...
              </div>
            </li>
            <li>
              <div>
                <h2>
                  <svg class="fa-link">
                    <use xlink:href="#fa-link"></use>
                  </svg>
                  Permalinks
                </h2>
                Go to a specific slide.
              </div>
            </li>
            <li>
              <div>
                <h2>
                  <svg class="fa-clock-o">
                    <use xlink:href="#fa-clock-o"></use>
                  </svg>
                  Slide Counter
                </h2>
                Current/Total number.
              </div>
            </li> -->
            <!-- <li>
              <div>
                <h2>
                  <span>40<sup>+</sup></span>
                  Beautiful Components
                </h2>
                Covers, cards, quotes...
              </div>
            </li>
            <li>
              <div>
                <h2>
                  <svg class="fa-text-height">
                    <use xlink:href="#fa-text-height"></use>
                  </svg>
                  Vertical Rhythm
                </h2>
                Use multiples of 8.
              </div>
            </li>
            <li>
              <div>
                <h2>
                  <span>500<sup>+</sup></span>
                  SVG Icons
                </h2>
                Font Awesome Kit.
              </div>
            </li>
          </ul> -->
        </div>
      </section>
</template>

<script>
import * as d3 from "d3";
import BubbleChart from "../charts/bubblechart.vue";

const CPI_DATA = window.location.origin + "/src/assets/data/cpi_data.csv";
const GOV_DATA = window.location.origin + "/src/assets/data/gov_data.csv";
const RATE_DATA = window.location.origin + "/src/assets/data/confirmed_rate_data.csv";

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
      current_date: "",
      date_list: [],
    }
  },
  components: {
    BubbleChart
  },
  created(){
    /* Fetch via Path */
    this.drawcpiFromCsv();
    this.drawgovFromCsv();
    this.drawrateFromCsv();
  },
  computed:{
    is_data_ready(){
      return(this.cpi_data_exists && this.gov_data_exists && this.rate_data_exists)
    }
  },
  mounted(){
    console.log("slide4 is mounted");
  },
  methods: {
    drawcpiFromCsv(){
      //async method
      d3.csv(CPI_DATA).then((data) => {
        // array of objects
        // console.log(data.length);
        // console.log(data);
        this.mycpiData = data;
        this.cpi_data_exists = true;
      });
    },
    drawgovFromCsv(){
      //async method
      d3.csv(GOV_DATA).then((data) => {
        // array of objects
        // console.log(data.length);
        // console.log(data);
        this.mygovData = data;
        this.gov_data_exists = true;
      });
    },
    drawrateFromCsv(){
      //async method
      d3.csv(RATE_DATA).then((data) => {
        // array of objects
        // console.log(data.length);
        // console.log(data);
        this.myrateData = data;
        this.rate_data_exists = true;
      });
    },
  }
}
</script>

<style scoped>
  .slide4Container{
    height: 100%;
    background-color: #af3030;
    display: flex;
  }
</style>
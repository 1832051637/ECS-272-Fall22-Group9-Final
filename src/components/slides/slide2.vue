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
      <MapChart v-if="!fetching && geoDataExists && cumDeathDataExists" :myGeoData="myGeoData"
        :myCumDeathData="myCumDeathData" :curr_date="curr_date"/>

      <!-- .end .bg-white shadow -->
    </div>
    <!-- .end .wrap -->
  </section>
</template>

<script>
import * as d3 from "d3";
import BarChart from "../charts/barchart.vue"
import MapChart from "../charts/map.vue"
import geoData from '../../assets/data/world_topo.json'

const TIME_SERIES_CUM_DEATH = "https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/master/data/timeseries/confirmed_deaths.csv"

export default {
  name: "slide2",
  data() {
    return {
      fetching: true,
      geoDataExists: false,
      cumDeathDataExists: false,
      dataExists: false,
      myGeoData: {},
      myCumDeathData: [],
      curr_date: "01Apr2022",
    }
  },

  components: {
    BarChart,
    MapChart
  },
  created() {
    console.log("slide2 is created")
    this.read_geojson()
    this.read_cum_death()
    this.fetching = false   // Data has been loaded
  },
  mounted() {
    console.log("slide2 is mounted")
    // this.tempGeoData = this.myGeoData
  },
  updated() {
    console.log("slide2 is updated")
  },
  methods: {
    read_geojson() {
      if (!geoData) {
        console.log("myGeoData not found")
        return
      }
      this.geoDataExists = true;
      this.myGeoData = geoData
    },
    read_cum_death() {
      //async method
      d3.csv(TIME_SERIES_CUM_DEATH)
        .then((data) => {
          // console.log(data)
          this.cumDeathDataExists = true
          this.myCumDeathData = data
        });
    },
  },

}
</script>

<style>

</style>
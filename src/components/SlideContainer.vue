<template>
  <main role="main">
    <article id="webslides" class="vertical">
      <!-- Quick Guide
          - Each parent <section> in the <article id="webslides"> element is an individual slide.
          - Vertical sliding = <article id="webslides" class="vertical">
          - <div class="wrap"> = container 90% / <div class="wrap size-50"> = 45%;
        -->
      <slide1 />
      <!-- <slide2 v-if="!fetching && geoDataExists && cumDeathDataExists" :myGeoData="myGeoData" :myCumDeathData="myCumDeathData" /> -->
      <slide2 />
      <slide3 />
      <slide4 />
      <slide5 />
      <slide6 />
      <slide7 />
      <slide8 />
    </article>
    <!-- end article -->
  </main>
  <!-- end main -->
</template>
<script>
// import * as d3 from "d3";
import slide1 from "./slides/slide1.vue"
import slide2 from "./slides/slide2.vue"
import slide3 from "./slides/slide3.vue"
import slide4 from "./slides/slide4.vue"
import slide5 from "./slides/slide5.vue"
import slide6 from "./slides/slide6.vue"
import slide7 from "./slides/slide7.vue"
import slide8 from "./slides/slide8.vue"

// import geoData from '../assets/data/world_topo.json'

// const TIME_SERIES_CUM_DEATH = "https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/master/data/timeseries/confirmed_deaths.csv"

export default {
  name: 'SlideContainer',
  // data() {
  //   return {
  //     fetching: true,
  //     geoDataExists: false,
  //     cumDeathDataExists: false,
  //     dataExists: false,
  //     myGeoData: {},
  //     myCumDeathData: [],
      
  //   }
  // },
  components: {
    slide1,
    slide2,
    slide3,
    slide4,
    slide5,
    slide6,
    slide7,
    slide8,
  },
  created() {
    // this.read_geojson()
    // this.read_cum_death()
    // this.fetching = false
  },
  mounted() {
    window.ws = new WebSlides();

  },
  // methods: {
  //   read_geojson() {
  //     if (!geoData) {
  //       console.log("myGeoData not found")
  //       return
  //     }
  //     this.geoDataExists = true;
  //     this.myGeoData = geoData
  //   },
  //   read_cum_death() {
  //           //async method
  //           d3.csv(TIME_SERIES_CUM_DEATH)
  //               .then((data) => {
  //                   // console.log(data)
  //                   this.cumDeathDataExists = true
  //                   this.myCumDeathData = data
  //               });
  //       },
  // }

}

</script>
<style>

</style>
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
      <MapChart :myGeoData="myGeoData" />

      <!-- .end .bg-white shadow -->
    </div>
    <!-- .end .wrap -->
  </section>
</template>

<script>
import BarChart from "../charts/barchart.vue"
import MapChart from "../charts/map.vue"

export default {
  name: "slide2",
  props: {
    myGeoData: Object,
  },
  components: {
    BarChart,
    MapChart
  },
  mounted() {
    console.log("slide2 is mounted", this.myGeoData)
    // this.tempGeoData = this.myGeoData
  },

}
</script>

<style>

</style>
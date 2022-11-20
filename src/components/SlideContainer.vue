<template>
  <main role="main">
    <article id="webslides" class="vertical">
      <!-- Quick Guide
          - Each parent <section> in the <article id="webslides"> element is an individual slide.
          - Vertical sliding = <article id="webslides" class="vertical">
          - <div class="wrap"> = container 90% / <div class="wrap size-50"> = 45%;
        -->
      <slide1/>
      <slide2/>
      <slide3/>
      <slide4/>
      <slide5/>
      <slide6/>
      <slide7/>
      <slide8/>
    </article>
    <!-- end article -->
  </main>
  <!-- end main -->
</template>
<script>
import slide1 from "./slides/slide1.vue"
import slide2 from "./slides/slide2.vue"
import slide3 from "./slides/slide3.vue"
import slide4 from "./slides/slide4.vue"
import slide5 from "./slides/slide5.vue"
import slide6 from "./slides/slide6.vue"
import slide7 from "./slides/slide7.vue"
import slide8 from "./slides/slide8.vue"

export default {
  name: 'SlideContainer',
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
  mounted() {
    window.ws = new WebSlides();
  },

}

</script>
<style>

</style>
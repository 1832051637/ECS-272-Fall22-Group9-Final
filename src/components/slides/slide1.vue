<template>
    <section>
        <span class="background" :style="'background-image: '+ `url('`+ img_path+ `')`"></span>
        <!--.wrap = container (width: 90%) -->
        <div class="wrap aligncenter">
          <h1><strong>Stories of Covid 19</strong></h1>
          <p class="text-intro">Write an introductions for covid-19<br>
            By Erjie Zhang, Yun Qin
          </p>
          <p>
            <a href="https://github.com/1832051637/ECS-272-Fall22-Group9-Final" class="button zoomIn"
              title="View our Github Repo">
              <svg class="fa-github">
                <use xlink:href="#fa-github"></use>
              </svg>
              Github
            </a>
          </p>
        </div>
        <!-- .end .wrap -->
      </section>
</template>

<script>

export default {
    name: "slide1",
    data() {
      return {
        img_path:  "/src/assets/images/global_event.png"
      }
    },
    components: {

    },
}
</script>

<style>
    
</style>

<template>
    <section class="fadeIn">
        <span class="background" :style="'background-image: '+ `url('`+ img_path+ `')`"></span>
        <!--.wrap = container (width: 90%) -->
        <div class="wrap aligncenter bg-info bg-gradient p-2 bg-opacity-50 py-5">
          <p class="display-1 opacity-100 text-light" style="font-weight: bold; font-family:Verdana, Arial, Tahoma, Serif;">Stories of Covid-19</p>
          <!-- <p class="text-intro">The World Health Organization (WHO) on March 11, 2020, declared the novel coronavirus (COVID-19) outbreak a global pandemic due to its rapid spread. 
            The COVID-19 pandemic has led to a dramatic loss of human life worldwide and presents an unprecedented challenge to public health, food systems, and the world of work.<br>
            This dashboard tells the COVID-19 story through a timeline, providing you an immersive journey of how COVID-19 spreads and people fight against the virus.
          </p> -->
          <p class="text-intro">By Erjie Zhang, Yun Qin</p>
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
        img_path:  "/src/assets/images/covid-background.jpeg"
      }
    },
    components: {

    },
}
</script>

<style>
    
</style>

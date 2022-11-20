
<template>
    <div id="app">
      <NavBar/>
      <SlideContainer/>
    </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import SlideContainer from "./components/SlideContainer.vue"

export default {
  name: 'app',
  components: {
    NavBar,
    SlideContainer
  }
}
</script>


<!-- <style>
</style> -->

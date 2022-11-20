<template>
  <!-- Navigation bar starts-->
  <header role="banner">
    <nav role="navigation">
      <p class="logo"><a href="index.html" title="Home">
          <!-- Write some thing for logo? -->
        </a></p>
      <ul>
        <li class="github">
          <a rel="external" href="https://github.com/webslides/webslides" title="Github">
            <svg class="fa-github">
              <use xlink:href="#fa-github"></use>
            </svg>
            <em>Github</em>
          </a>
        </li>
        <li class="twitter">
          <a rel="external" href="https://cs.ucdavis.edu/graduate" title="View our university program">
            <svg class="fa-graduation-cap">
              <use xlink:href="#fa-graduation-cap"></use>
            </svg>
            <em>UC Davis</em>
          </a>
        </li>
        <!--  <li class="dribbble"><a rel="external" href="http://dribbble.com/webslides" title="Dribbble"><svg class="fa-dribbble"><use xlink:href="#fa-dribbble"></use></svg> <em>webslides</em></a></li> -->
      </ul>
    </nav>
  </header>
  <!-- Navigation bar ends-->
</template>
<script>
export default {
  name: 'NavBar',
  components: {
  },
}
</script>
<style>

</style>

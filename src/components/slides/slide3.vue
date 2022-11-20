<template>

    <section>
        <!--.wrap = container (width: 90%) -->
        <div class="wrap">
            <div class="grid vertical-align">
                <div class="column">
                    <h3><strong>WebSlides is really easy</strong></h3>
                    <p class="text-intro">Each parent <code>&lt;section&gt;</code> in the #webslides element is an
                        individual
                        slide. </p>
                    <p>Code is clean and scalable. It uses <strong>intuitive markup</strong> with popular naming
                        conventions.
                        There's no need to overuse classes or nesting. <strong>Making an HTML presentation has never
                            been so
                            fast</strong>.</p>
                </div>
                <!-- .end .column -->
                <div class="column">
                    <pre>&lt;article id="webslides"&gt;
  <span class="code-comment">&lt;!-- Slide 1 --&gt;</span>
  &lt;section&gt;
    &lt;h1&gt;Design for trust&lt;/h1&gt;
  &lt;/section&gt;
  <span class="code-comment">&lt;!-- Slide 2 --&gt;</span>
  &lt;section class="bg-primary"&gt;
    &lt;div class="wrap"&gt;
      &lt;h2&gt;.wrap = container (width: 90%)&lt;/h2&gt;
    &lt;/div&gt;
  &lt;/section&gt;
&lt;/article&gt;
</pre>
                </div>
                <!-- .end .column -->
            </div>
            <!-- .end .grid -->
        </div>
        <!-- .end .wrap -->
    </section>
</template>

<script>
export default {
    name: "slide3",
    components: {

    },
}
</script>

<style>

</style>
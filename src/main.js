import { createApp } from 'vue'
import App from './App.vue'

// Required
import "./js/webslides.js"

// OPTIONAL - svg-icons.js (fontastic.me - Font Awesome as svg icons)
import "./js/svg-icons.js"

// All charts css
import './style/charts.css'

// WebSlides css 
import './style/webslides.css'

// SVG Icons (Font Awesome) css
import './style/svg-icons.css'


createApp(App).mount('#app')

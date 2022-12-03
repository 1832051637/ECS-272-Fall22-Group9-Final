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

// Slider css
import "./style/slider.css";

//
import "bootstrap/dist/css/bootstrap.css"

import "bootstrap"

import "bootstrap/dist/js/bootstrap.js"
import "bootstrap/dist/js/bootstrap.bundle.js"

createApp(App).mount('#app')

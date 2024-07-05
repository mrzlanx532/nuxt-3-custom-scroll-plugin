import { createApp } from 'vue'
import App from './App.vue'

import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/common.css';
import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/document-scroll.no-ssr.css';
import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/v-scrollable.css';

import { Scrollable } from '@mrzlanx532/nuxt-3-custom-scroll-plugin'

const app = createApp(App)

app.directive('scrollable', {
    mounted: function (el, binding) {
        new Scrollable(el, binding.value)
    }
})
app.mount('#app')

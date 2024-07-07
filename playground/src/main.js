import { createApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'

import App from './App.vue'

import Index from '../pages/Index.vue'
import Modal from '../pages/Modal.vue'

import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/common.css';
import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/document-scroll.no-ssr.css';
import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/v-scrollable.css';

import { Scrollable } from '@mrzlanx532/nuxt-3-custom-scroll-plugin'

const routes = [
    { path: '/', component: Index },
    { path: '/modal', component: Modal }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

const app = createApp(App)

app.use(router)
app.directive('scrollable', {
    mounted: function (el, binding) {
        new Scrollable(el, binding.value)
    }
})
app.mount('#app')

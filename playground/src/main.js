import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import Index from '../pages/index.vue'
import Modal from '../pages/modal.vue'

import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/common.css';
import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/document-scroll.no-ssr.css';
import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/v-scrollable.css';

import { Scrollable } from '@mrzlanx532/nuxt-3-custom-scroll-plugin'

const routes = [
    { path: '/', component: Index },
    { path: '/modal', component: Modal }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)

app.use(router)
app.directive('scrollable', {
    mounted: function (el, binding) {
        el.scrollable_manager = new Scrollable(el, binding.value)
    },
    unmounted: function (el, binding) {
        el.scrollable_manager.destroy()
    }
})
app.mount('#app')

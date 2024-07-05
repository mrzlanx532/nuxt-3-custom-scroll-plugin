<script setup>
import { onMounted } from 'vue'
import { DocumentScroll } from 'nuxt-3-custom-scroll-plugin/dist/index.js'

onMounted(() => {
  window.documentScroll = new DocumentScroll

  try {
    new ResizeObserver(() => {
      window.documentScroll.updateScroll()
    }).observe(document.documentElement)
  } catch (e) {
    console.warn('Не удалось установить ResizeObserver для document')
  }
})
import Example from './components/Example.vue'
</script>

<template>
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
  </head>
  <body>
    <div>Привет</div>
    <Example/>
  </body>
  </html>
</template>
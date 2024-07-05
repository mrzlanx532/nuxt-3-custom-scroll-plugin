# Установка

## Общее
`npm i @mrzlanx532/nuxt-3-custom-scroll-plugin`

## Установка в модуль Nuxt 3
```js
import { defineNuxtPlugin, onNuxtReady } from '#app'

import 'nuxt-3-custom-scroll-plugin/assets/common.css'

/** Установка v-scrollable директивы + css */
import { Scrollable } from 'nuxt-3-custom-scroll-plugin'
import 'nuxt-3-custom-scroll-plugin/assets/v-scrollable.css'

/** Установка DocumentScroll + css */
import { DocumentScroll } from 'nuxt-3-custom-scroll-plugin'
import 'nuxt-3-custom-scroll-plugin/assets/document-scroll.no-ssr.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('scrollable', {
        mounted: function (el, binding) {
            new Scrollable(el, binding.value)
        }
    })
    onNuxtReady(async () => {
        window.documentScroll = new DocumentScroll

        try {
            new ResizeObserver(() => {
                window.documentScroll.updateScroll()
            }).observe(document.documentElement)
        } catch (e) {
            console.warn('Не удалось установить ResizeObserver для document')
        }
    })
})
```


# CSS Variables

## Scrollable
```css
:root {
    --scrollable-track-background: transparent;
    --scrollable-slider-background: transparent;    
}
```

## DocumentScroll
```css
:root {
    --document-scroll-border-radius: 5px;
    --document-scroll-thickness: 4px;
    --document-scroll-background: grey;
    --document-scroll-track-background: transparent;
    --document-scroll-track-border-radius: 0;
    --document-scroll-thickness-hover-active: 8px;    
}
```

# Разработка и дебаг
`cd ./playground && npm install && npm run dev`
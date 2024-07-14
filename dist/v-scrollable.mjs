import createElementWithClass from './helpers.mjs'

export default class Scrollable {
    MIN_SCROLL_HEIGHT = 30

    isDragIsActive = false

    constructor(el, options = {}) {

        this.wrapTarget(el, options)
        this.setListeners()
        this.updateScroll = this.updateScroll.bind(this)
        this.updateScroll()

        window.addEventListener('resize', this.updateScroll)
        this.el.addEventListener('scroll', this.updateScroll)
        this.el.addEventListener('mouseenter', this.updateScroll)

        new ResizeObserver(() => {
            this.updateScroll()
            this.el.classList.add('v-scrollable_active')
        }).observe(this.el);
    }

    setListeners() {

        let prevClientY
        let prevClientX
        let mouseDownOffsetY
        let mouseDownOffsetX
        let mouseDownOffsetHeight
        let mouseDownOffsetWidth

        const ctx = this

        const mouseUpListenerY = function () {
            document.documentElement.classList.remove('scrollable_grabbed');

            document.removeEventListener('mousemove', mouseMoveListenerY);
            document.removeEventListener('mouseup', mouseUpListenerY);

            ctx.isDragIsActive = false
        }

        const mouseUpListenerX = function () {
            document.documentElement.classList.remove('scrollable_grabbed');

            document.removeEventListener('mousemove', mouseMoveListenerX);
            document.removeEventListener('mouseup', mouseUpListenerX);

            ctx.isDragIsActive = false
        }

        const mouseMoveListenerY = function (e) {

            prevClientY = e.clientY;

            window.requestAnimationFrame(function() {
                let sliderYValue = e.clientY - mouseDownOffsetY - ctx.trackY.getBoundingClientRect().top
                let scrollTopValue = sliderYValue * ctx.multiplierYReverse

                if (sliderYValue > ctx.distanceScrollY) {
                    sliderYValue = ctx.distanceScrollY
                }

                ctx.sliderY.style.transform = 'translateY(' + (sliderYValue < 0 ? 0 : sliderYValue) + 'px)'

                ctx.el.scrollTop = scrollTopValue
            });
        }

        const mouseMoveListenerX = function (e) {

            prevClientX = e.clientX;

            window.requestAnimationFrame(function() {
                let sliderXValue = e.clientX - mouseDownOffsetX - ctx.trackX.getBoundingClientRect().left
                let scrollLeftValue = sliderXValue * ctx.multiplierXReverse

                if (sliderXValue > ctx.distanceScrollX) {
                    sliderXValue = ctx.distanceScrollX
                }

                ctx.sliderX.style.transform = 'translateX(' + (sliderXValue < 0 ? 0 : sliderXValue) + 'px)'

                ctx.el.scrollLeft = scrollLeftValue
            });
        }

        const mouseDownListener = function (mouseMoveListener, mouseUpListener, e) {

            ctx.isDragIsActive = true

            mouseDownOffsetY = e.offsetY
            mouseDownOffsetHeight = e.target.offsetHeight
            prevClientY = e.clientY

            mouseDownOffsetX = e.offsetX;
            mouseDownOffsetWidth = e.target.offsetWidth;
            prevClientX = e.clientX;

            document.documentElement.classList.add('scrollable_grabbed');

            document.addEventListener('mousemove', mouseMoveListener)
            document.addEventListener('mouseup', mouseUpListener)

            return false
        }

        ctx.sliderX.addEventListener('mousedown', mouseDownListener.bind(ctx, mouseMoveListenerX, mouseUpListenerX))
        ctx.sliderY.addEventListener('mousedown', mouseDownListener.bind(ctx, mouseMoveListenerY, mouseUpListenerY))
    }

    updateDimensions() {
        let height = this.el.clientHeight / (this.el.scrollHeight / this.el.clientHeight)

        this.sliderYHeight = height < this.MIN_SCROLL_HEIGHT ? this.MIN_SCROLL_HEIGHT : height;
        this.sliderYHeightWithoutRestrictions = height

        let width = this.el.clientWidth / (this.el.scrollWidth / this.el.clientWidth)

        this.sliderXWidth = width < this.MIN_SCROLL_HEIGHT ? this.MIN_SCROLL_HEIGHT : width;
        this.sliderXWidthWithoutRestrictions = width
    }

    updateScroll() {

        this.updateDimensions()

        const clientRect = this.el.getBoundingClientRect()

        this.distanceScrollY = clientRect.height - this.sliderYHeight
        this.distanceScrollX = clientRect.width - this.sliderXWidth

        this.multiplierY = this.distanceScrollY / (this.el.scrollHeight - this.el.clientHeight)
        this.multiplierYReverse = this.el.scrollHeight / (clientRect.height - (this.sliderYHeight - this.sliderYHeightWithoutRestrictions))

        this.multiplierX = this.distanceScrollX / (this.el.scrollHeight - this.el.clientWidth)
        this.multiplierXReverse = this.el.scrollWidth / (clientRect.width - (this.sliderXWidth - this.sliderXWidthWithoutRestrictions))

        const ctx = this

        /**
         * Временно закоментировал:
         *
         * Долго пропадал скрол и было видно, когда элемент пропадает в фильтре даты в годах:
         * https://app.asana.com/0/1205846888116957/1207582173354072
         *
         * Если не увижу разницы в работе других скроллов, то удалить насовсем
         **/
        //window.requestAnimationFrame(function() {
            ctx.renderYScroll()
            ctx.renderXScroll()
        //});
    }

    renderYScroll() {
        if (
            (this.el.clientHeight / this.el.scrollHeight >= 1) ||
            (this.el.clientHeight === 0 && this.el.scrollHeight === 0)
        ) {
            this.trackY.classList.add('scrollable_hidden')

            return
        }

        this.trackY.classList.remove('scrollable_hidden')
        this.sliderY.style.height = `${this.sliderYHeight}px`

        if (this.isDragIsActive) {
            return
        }

        this.trackY.style.height = this.el.clientHeight + 'px'
        this.sliderY.style.transform = 'translateY(' + this.el.scrollTop * this.multiplierY  + 'px)'
    }
    renderXScroll() {
        if (
            (this.el.clientWidth / this.el.scrollWidth >= 1) ||
            (this.el.clientWidth === 0 && this.el.scrollHeight === 0)
        ) {
            this.trackX.classList.add('scrollable_hidden')

            return
        }

        this.trackX.classList.remove('scrollable_hidden')
        this.sliderX.style.width = `${this.sliderXWidth}px`

        if (this.isDragIsActive) {
            return
        }

        this.sliderX.style.transform = 'translateX(' + this.el.scrollLeft * this.multiplierX  + 'px'
    }

    wrapTarget(el, options) {

        this.el = el

        const parentNode = el.parentNode

        this.root = createElementWithClass('scrollable__container')

        if (options.hasOwnProperty('classes') && Array.isArray(options.classes)) {

            options.classes.map((className) => {

                this.el.classList.add(className)
                this.root.classList.add(className)

                if (className === '--smart-opacity') {
                    setTimeout(() => {
                        this.root.classList.add('--smart-opacity-enabled')
                    })
                }
            });
        }

        const computedStyles = window.getComputedStyle(this.el)
        const computedStylesParentNode = window.getComputedStyle(parentNode)

        const mo = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {

                console.log(mutation)

                if (!this.el.classList.contains('scrollable__content')) {
                    this.el.classList.add('scrollable__content')
                }
            })
        })
        mo.observe(el, {
            attributes: true,
            attributeFilter: ['class']
        })

        this.trackY = createElementWithClass('scrollable__track-y')
        this.trackX = createElementWithClass('scrollable__track-x')
        this.sliderY = createElementWithClass('scrollable__slider-y')
        this.sliderX = createElementWithClass('scrollable__slider-x')
        this.wrapper = createElementWithClass('scrollable__wrapper')

        this.root.appendChild(this.wrapper)

        this.trackY.appendChild(this.sliderY)
        this.trackX.appendChild(this.sliderX)

        el.classList.add('scrollable__content')

        parentNode.replaceChild(this.root, el)

        this.wrapper.appendChild(el)

        this.wrapper.appendChild(this.trackY)
        this.wrapper.appendChild(this.trackX)

        if (computedStylesParentNode.display === 'flex') {
            this.root.style.overflow = 'hidden'
        }

        this.trackY.style.top = computedStyles.top
        this.trackX.style.left = computedStyles.left

        if (options?.inheritanceDimensions === true) {
            this.root.style.maxHeight = computedStyles.maxHeight
            this.root.style.maxWidth = computedStyles.maxWidth

            if (computedStyles.width !== '0px') {
                this.root.style.width = computedStyles.width
            }

            if (computedStyles.height !== '0px') {
                this.root.style.height = computedStyles.height
            }
        }
    }
}
import createElementWithClass from './helpers.mjs'

export default class DocumentScroll {
    MIN_SCROLL_HEIGHT = 30

    isDragIsActive = false

    constructor() {
        this.wrapElement()
        this.setListeners()
        this.updateScroll = this.updateScroll.bind(this)
        this.updateScroll()

        window.addEventListener('resize', this.updateScroll)
        document.addEventListener('scroll', this.updateScroll)
        document.addEventListener('mouseenter', this.updateScroll)
    }
    wrapElement() {
        const container = createElementWithClass('document-scroll__container')
        const overlay = createElementWithClass('document-scroll__overlay')

        this.trackY = createElementWithClass('document-scroll__track-y')
        this.trackX = createElementWithClass('document-scroll__track-x')

        this.sliderY = createElementWithClass('document-scroll__slider-y')
        this.sliderX = createElementWithClass('document-scroll__slider-x')

        overlay.appendChild(this.trackY)
        this.trackY.appendChild(this.sliderY)

        overlay.appendChild(this.trackX)
        this.trackX.appendChild(this.sliderX)

        container.appendChild(overlay)

        document.body.insertBefore(container, document.body.firstChild)
    }
    updateScroll() {
        this.updateDimensions();

        this.distanceScrollYNative = document.documentElement.scrollHeight - document.documentElement.clientHeight
        this.distanceScrollY = document.documentElement.clientHeight - this.sliderYHeight

        this.distanceScrollXNative = document.documentElement.scrollWidth - document.documentElement.clientWidth
        this.distanceScrollX = document.documentElement.clientWidth - this.sliderXWidth

        this.multiplierY = this.distanceScrollY / this.distanceScrollYNative
        this.multiplierYReverse = document.documentElement.scrollHeight / (document.documentElement.clientHeight - (this.sliderYHeight - this.sliderYHeightWithoutRestrictions))

        this.multiplierX = this.distanceScrollX / this.distanceScrollXNative
        this.multiplierXReverse = document.documentElement.scrollWidth / (document.documentElement.clientWidth - (this.sliderXWidth - this.sliderXWidthWithoutRestrictions))

        const ctx = this

        window.requestAnimationFrame(function() {
            ctx.renderYScroll()
            ctx.renderXScroll()
        });
    }
    renderYScroll() {
        if (document.documentElement.clientHeight / document.documentElement.scrollHeight >= 1) {
            this.trackY.classList.add('document-scroll_hidden')

            return
        }

        this.trackY.classList.remove('document-scroll_hidden')
        this.sliderY.style.height = `${this.sliderYHeight}px`

        if (this.isDragIsActive) {
            return
        }

        this.sliderY.style.transform = 'translateY(' + document.documentElement.scrollTop * this.multiplierY  + 'px)'
    }
    renderXScroll() {
        if (document.documentElement.clientWidth / document.documentElement.scrollWidth >= 1) {
            this.trackX.classList.add('document-scroll_hidden')

            return
        }

        this.trackX.classList.remove('document-scroll_hidden')
        this.sliderX.style.width = `${this.sliderXWidth}px`

        if (this.isDragIsActive) {
            return
        }

        this.sliderX.style.transform = 'translateX(' + document.documentElement.scrollLeft * this.multiplierX  + 'px'
    }
    updateDimensions() {
        let height = document.documentElement.clientHeight / (document.documentElement.scrollHeight / document.documentElement.clientHeight)

        this.sliderYHeight = height < this.MIN_SCROLL_HEIGHT ? this.MIN_SCROLL_HEIGHT : height;
        this.sliderYHeightWithoutRestrictions = height

        let width = document.documentElement.clientWidth / (document.documentElement.scrollWidth / document.documentElement.clientWidth)

        this.sliderXWidth = width < this.MIN_SCROLL_HEIGHT ? this.MIN_SCROLL_HEIGHT : width;
        this.sliderXWidthWithoutRestrictions = width
    }
    turnOn() {
        document.documentElement.style.overflow = 'auto'

        this.trackY.classList.remove('document-scroll_hidden')
        this.trackX.classList.remove('document-scroll_hidden')

        window.addEventListener('resize', this.updateScroll)
        document.addEventListener('scroll', this.updateScroll)
        document.addEventListener('mouseenter', this.updateScroll)

        this.updateScroll()
    }
    turnOff() {
        document.documentElement.style.overflow = 'hidden'

        this.trackY.classList.add('document-scroll_hidden')
        this.trackX.classList.add('document-scroll_hidden')

        window.removeEventListener('resize', this.updateScroll)
        document.removeEventListener('scroll', this.updateScroll)
        document.removeEventListener('mouseenter', this.updateScroll)
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
            document.documentElement.classList.remove('document-scroll_grabbed');

            document.removeEventListener('mousemove', mouseMoveListenerY);
            document.removeEventListener('mouseup', mouseUpListenerY);

            ctx.isDragIsActive = false
        }

        const mouseUpListenerX = function () {
            document.documentElement.classList.remove('document-scroll_grabbed');

            document.removeEventListener('mousemove', mouseMoveListenerX);
            document.removeEventListener('mouseup', mouseUpListenerX);

            ctx.isDragIsActive = false
        }

        const mouseMoveListenerY = function (e) {

            prevClientY = e.clientY;

            window.requestAnimationFrame(function() {
                let sliderYValue = e.clientY - mouseDownOffsetY
                let scrollTopValue = sliderYValue * ctx.multiplierYReverse

                if (sliderYValue > ctx.distanceScrollY) {
                    sliderYValue = ctx.distanceScrollY
                }

                ctx.sliderY.style.transform = 'translateY(' + (sliderYValue < 0 ? 0 : sliderYValue) + 'px)'

                document.documentElement.scrollTop = scrollTopValue
            });
        }

        const mouseMoveListenerX = function (e) {

            prevClientX = e.clientX;

            window.requestAnimationFrame(function() {
                let sliderXValue = e.clientX - mouseDownOffsetX
                let scrollLeftValue = sliderXValue * ctx.multiplierXReverse

                if (sliderXValue > ctx.distanceScrollX) {
                    sliderXValue = ctx.distanceScrollX
                }

                ctx.sliderX.style.transform = 'translateX(' + (sliderXValue < 0 ? 0 : sliderXValue) + 'px)'

                document.documentElement.scrollLeft = scrollLeftValue
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

            document.documentElement.classList.add('document-scroll_grabbed');

            document.addEventListener('mousemove', mouseMoveListener)
            document.addEventListener('mouseup', mouseUpListener)

            return false
        }

        ctx.sliderX.addEventListener('mousedown', mouseDownListener.bind(ctx, mouseMoveListenerX, mouseUpListenerX))
        ctx.sliderY.addEventListener('mousedown', mouseDownListener.bind(ctx, mouseMoveListenerY, mouseUpListenerY))
    }
}
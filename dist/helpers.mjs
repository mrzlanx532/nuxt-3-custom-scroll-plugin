export default function createElementWithClass(className) {
    const el = document.createElement('div')
    el.setAttribute('class', className)
    return el
}
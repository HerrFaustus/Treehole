const spanBox = document.querySelector('#spanBox')

window.onclick = function (e) {
    if (spanBox.childElementCount < 10) {
        var e = window.event;
        const x = e.clientX;
        const y = e.clientY;

        const ripple = document.createElement('span')
        ripple.setAttribute("class", "Ripples")

        let color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16)
        ripple.style.left = x + 'px'
        ripple.style.top = y + 'px'

        ripple.style.borderColor = color
        spanBox.appendChild(ripple)

        setTimeout(() => {
            ripple.remove()
        }, Math.floor((Math.random() + 1) * 1200))
    }
}
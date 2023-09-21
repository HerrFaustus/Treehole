function scrollToTop() {
    anchorElement = document.getElementById("page-top");
    anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth'});
}

window.onscroll = function () {
    let currentHeight =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
    if (currentHeight > 300) {
        document.getElementById('top-button').style.display = 'block'
    } else {
        document.getElementById('top-button').style.display = 'none'
    }
}
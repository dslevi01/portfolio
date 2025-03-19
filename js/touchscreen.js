function disableHoverOnTouch() {
    document.body.classList.add("no-hover");

    setTimeout(() => {
        document.body.classList.remove("no-hover");
    }, 500); // Re-enable after 0.5s in case it's a hybrid device
}

if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    document.addEventListener("touchstart", disableHoverOnTouch);
}

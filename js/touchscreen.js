document.addEventListener("DOMContentLoaded", function () {
    if ("ontouchstart" in window) {
        document.body.classList.add("no-hover");

        document.addEventListener("touchstart", function () {
            document.body.classList.add("no-hover");
        });

        document.addEventListener("mousemove", function () {
            document.body.classList.remove("no-hover");
        });
    }
});
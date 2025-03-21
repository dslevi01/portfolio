document.addEventListener("DOMContentLoaded", function () {
    const mediaContainer = document.querySelector(".sketches-media");
    const mediaImages = document.querySelectorAll(".sketches-image");

    let lastTapTime = 0; // Track last tap time for touch devices

    function expandImage(img) {
        if (img.classList.contains("expanded")) {
            resetImage(img);
            return;
        }

        document.querySelectorAll(".sketches-image.expanded").forEach(resetImage);

        img.classList.add("expanded", "no-blur");
        img.style.zIndex = "10";
        mediaContainer.classList.add("expanding");
    }

    function resetImage(img) {
        img.classList.remove("expanded");

        setTimeout(() => {
            img.style.zIndex = "1";
            img.classList.remove("no-blur");

            if (!document.querySelector(".sketches-image.expanded")) {
                mediaContainer.classList.remove("expanding");
            }
        }, 300);
    }

    mediaImages.forEach(img => {
        img.addEventListener("dblclick", (event) => {
            event.stopPropagation();
            expandImage(img);
        });

        img.addEventListener("touchend", (event) => {
            const currentTime = Date.now();
            if (currentTime - lastTapTime < 300) expandImage(img);
            lastTapTime = currentTime;
        });
    });

    // Close images when clicking/tapping outside
    document.addEventListener("click", closeExpandedImages);
    document.addEventListener("touchstart", closeExpandedImages);

    function closeExpandedImages(event) {
        if (!event.target.closest(".sketches-image")) {
            document.querySelectorAll(".sketches-image.expanded").forEach(resetImage);
        }
    }
});

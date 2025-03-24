document.addEventListener("DOMContentLoaded", function () {
    const mediaContainer = document.querySelector(".sketches-media");
    const mediaImages = document.querySelectorAll(".sketches-image");

    let zIndexCounter = 10; // Start high so new images appear on top

    function expandImage(img) {
        if (img.classList.contains("expanded")) {
            resetImage(img);
            return;
        }

        document.querySelectorAll(".sketches-image.expanded").forEach(resetImage);

        zIndexCounter++; // Increase z-index so last expanded stays on top
        img.style.zIndex = zIndexCounter;

        img.classList.add("expanded", "no-blur");
        mediaContainer.classList.add("expanding");
    }

    function resetImage(img) {
        img.classList.remove("expanded");

        setTimeout(() => {
            img.classList.remove("no-blur");

            if (!document.querySelector(".sketches-image.expanded")) {
                mediaContainer.classList.remove("expanding");
            }
        }, 300);
    }

    mediaImages.forEach(img => {
        img.addEventListener("click", (event) => {
            event.stopPropagation();
            expandImage(img);
        });

        img.addEventListener("touchend", (event) => {
            event.stopPropagation();
            expandImage(img);
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

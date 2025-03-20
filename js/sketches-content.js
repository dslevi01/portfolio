document.addEventListener("DOMContentLoaded", function () {
    const mediaContainer = document.querySelector(".sketches-media");
    const mediaImages = document.querySelectorAll(".sketches-image");

    mediaImages.forEach(img => {
        let expandTimeout = null;

        function expandImage() {
            img.classList.add("expanded");
            img.classList.add("no-blur"); // Prevent blur on this one
            img.style.zIndex = "10"; // Bring to front
            mediaContainer.classList.add("expanding"); // Add blur to others
        }

        function resetImage() {
            clearTimeout(expandTimeout);
            img.classList.remove("expanded");

            setTimeout(() => {
                img.style.zIndex = "1"; // Move back down
                img.classList.remove("no-blur"); // Allow blur again

                // If no images are expanded, remove the background blur effect
                if (!document.querySelector(".sketches-image.expanded")) {
                    mediaContainer.classList.remove("expanding");
                }
            }, 300); // Matches CSS transition time
        }

        // Desktop hover
        img.addEventListener("mouseenter", () => {
            expandTimeout = setTimeout(expandImage, 600);
        });
        img.addEventListener("mouseleave", resetImage);

        // Touch & hold
        img.addEventListener("touchstart", () => {
            expandTimeout = setTimeout(expandImage, 600);
        });
        img.addEventListener("touchend", resetImage);
        img.addEventListener("touchmove", resetImage);
    });
});

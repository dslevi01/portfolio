document.addEventListener("DOMContentLoaded", () => {
    let mediaContainer, mediaItems, leftBtn, rightBtn, currentIndex = 0;
    let isMobile = window.innerWidth < 1065;

    function initialize() {
        isMobile = window.innerWidth < 1065;

        if (isMobile) {
            mediaContainer = document.querySelector(".phone-grid .crafts-media-container");
            leftBtn = document.querySelector(".phone-grid .tile-bt-left");
            rightBtn = document.querySelector(".phone-grid .tile-bt-right");
        } else {
            mediaContainer = document.querySelector(".grid .crafts-media-container");
            leftBtn = document.querySelector(".grid .tile-bt-left");
            rightBtn = document.querySelector(".grid .tile-bt-right");
        }

        if (!mediaContainer || !leftBtn || !rightBtn) return;
        mediaItems = mediaContainer.querySelectorAll("img, video"); // Include both images & videos
        if (mediaItems.length === 0) return;

        // Reset index when switching layouts
        currentIndex = 0;

        addEventListeners();
    }

    function addEventListeners() {
        leftBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
            scrollToCurrent();
        });

        rightBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % mediaItems.length;
            scrollToCurrent();
        });

        if (isMobile) {
            addSwipeListeners();
        }
    }

    function scrollToCurrent() {
        mediaItems[currentIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }

    function addSwipeListeners() {
        let startX = 0;
        let endX = 0;

        mediaContainer.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        mediaContainer.addEventListener("touchmove", (e) => {
            endX = e.touches[0].clientX;
        });

        mediaContainer.addEventListener("touchend", () => {
            let diff = startX - endX;
            if (Math.abs(diff) > 50) { // Ensure a meaningful swipe
                currentIndex = diff > 0
                    ? (currentIndex + 1) % mediaItems.length  // Swiped left → Next
                    : (currentIndex - 1 + mediaItems.length) % mediaItems.length; // Swiped right → Previous
                scrollToCurrent();
            }
        });
    }

    // Run on load
    initialize();

    // Reinitialize when screen size changes
    window.addEventListener("resize", initialize);
});

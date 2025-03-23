document.addEventListener("DOMContentLoaded", () => {
    let mediaContainer, mediaItems, leftBtn, rightBtn, currentIndex = 0;
    let isMobile = window.innerWidth < 1065;

    function initialize() {
        isMobile = window.innerWidth < 1065;

        // Get elements based on screen size
        mediaContainer = document.querySelector(isMobile ? ".phone-grid .crafts-media-container" : ".grid .crafts-media-container");
        leftBtn = document.querySelector(isMobile ? ".phone-grid .tile-bt-left" : ".grid .tile-bt-left");
        rightBtn = document.querySelector(isMobile ? ".phone-grid .tile-bt-right" : ".grid .tile-bt-right");

        if (!mediaContainer || !leftBtn || !rightBtn) return;

        mediaItems = mediaContainer.querySelectorAll("img, video"); // Select images & videos
        if (mediaItems.length === 0) return;

        // Reset index when switching layouts
        currentIndex = 0;

        // Remove old event listeners before adding new ones
        removeEventListeners();
        addEventListeners();
    }

    function addEventListeners() {
        leftBtn.addEventListener("click", handleLeftClick);
        rightBtn.addEventListener("click", handleRightClick);

        if (isMobile) {
            addSwipeListeners();
        }
    }

    function removeEventListeners() {
        leftBtn?.removeEventListener("click", handleLeftClick);
        rightBtn?.removeEventListener("click", handleRightClick);
    }

    function handleLeftClick() {
        currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
        scrollToCurrent();
    }

    function handleRightClick() {
        currentIndex = (currentIndex + 1) % mediaItems.length;
        scrollToCurrent();
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

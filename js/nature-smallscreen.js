document.addEventListener("DOMContentLoaded", function () {
    function initMediaControls() {
        if (window.innerWidth >= 1065) return;

        const subSection = document.querySelector(".sub-section");
        if (!subSection) return; 

        const mediaContainer = subSection.querySelector(".nature-media-container");
        const mediaItems = Array.from(mediaContainer.querySelectorAll("video, img"));
        const playPauseBtn = subSection.querySelector(".nature-bt.play-pause img");
        const muteBtn = subSection.querySelector(".nature-bt.sound-mute img");
        const leftBtn = subSection.querySelector(".nature-bt-left");
        const rightBtn = subSection.querySelector(".nature-bt-right");

        let currentIndex = 0;

        function stopCurrentVideo() {
            const currentMedia = mediaItems[currentIndex];
            if (currentMedia.tagName === "VIDEO" && !currentMedia.paused) {
                currentMedia.pause();
            }
        }

        function updateMediaView() {
            mediaContainer.scrollTo({
                left: mediaItems[currentIndex].offsetLeft - mediaContainer.offsetLeft,
                behavior: "smooth"
            });

            const currentMedia = mediaItems[currentIndex];
            const isVideo = currentMedia.tagName === "VIDEO";

            function updateButtonState(button, isActive, activeSrc) {
                button.src = isActive ? activeSrc : "assets/ghost.svg";
                button.parentElement.style.pointerEvents = isActive ? "auto" : "none";
            }

            updateButtonState(playPauseBtn, isVideo, currentMedia.paused ? "assets/play.svg" : "assets/pause.svg");
            updateButtonState(muteBtn, isVideo, currentMedia.muted ? "assets/mute.svg" : "assets/sound.svg");

            if (isVideo) {
                playPauseBtn.setAttribute("aria-label", currentMedia.paused ? "play" : "pause");
                muteBtn.setAttribute("aria-label", currentMedia.muted ? "unmute" : "mute");

                playPauseBtn.parentElement.onmouseover = function () {
                    playPauseBtn.src = currentMedia.paused ? "assets/play-hover.svg" : "assets/pause-hover.svg";
                };
                playPauseBtn.parentElement.onmouseout = function () {
                    playPauseBtn.src = currentMedia.paused ? "assets/play.svg" : "assets/pause.svg";
                };
            }
        }

        playPauseBtn.parentElement.addEventListener("click", () => {
            if (playPauseBtn.parentElement.style.pointerEvents === "none") return;
            const currentMedia = mediaItems[currentIndex];
            if (currentMedia.tagName === "VIDEO") {
                if (currentMedia.paused) {
                    currentMedia.play();
                    playPauseBtn.setAttribute("aria-label", "pause");
                } else {
                    currentMedia.pause();
                    playPauseBtn.setAttribute("aria-label", "play");
                }
                updateMediaView();
            }
        });

        muteBtn.parentElement.addEventListener("click", () => {
            if (muteBtn.parentElement.style.pointerEvents === "none") return;
            const currentMedia = mediaItems[currentIndex];
            if (currentMedia.tagName === "VIDEO") {
                currentMedia.muted = !currentMedia.muted;
                muteBtn.setAttribute("aria-label", currentMedia.muted ? "unmute" : "mute");
                updateMediaView();
            }
        });

        leftBtn.addEventListener("click", () => {
            stopCurrentVideo();
            currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
            updateMediaView();
        });

        rightBtn.addEventListener("click", () => {
            stopCurrentVideo();
            currentIndex = (currentIndex + 1) % mediaItems.length;
            updateMediaView();
        });

        let startX = 0;
        mediaContainer.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        mediaContainer.addEventListener("touchend", (e) => {
            let endX = e.changedTouches[0].clientX;
            let diff = startX - endX;
            if (Math.abs(diff) > 50) {
                stopCurrentVideo();
                diff > 0 ? rightBtn.click() : leftBtn.click();
            }
        });

        mediaContainer.addEventListener("wheel", (e) => {
            if (Math.abs(e.deltaX) > 10 || Math.abs(e.deltaY) > 10) {
                stopCurrentVideo();
            }
        });

        updateMediaView();
    }

    // Run once on load
    initMediaControls();

    // Listen for window resize and reinitialize if needed
    window.matchMedia("(max-width: 1065px)").addEventListener("change", (e) => {
        if (e.matches) {
            initMediaControls();
        }
    });
});

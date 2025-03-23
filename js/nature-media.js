document.addEventListener("DOMContentLoaded", function () {
    const mediaContainer = document.querySelector(".nature-media-container");
    const mediaItems = Array.from(mediaContainer.querySelectorAll("video, img"));
    const playPauseBtn = document.querySelector(".nature-bt.play-pause img");
    const muteBtn = document.querySelector(".nature-bt.sound-mute img");
    const leftBtn = document.querySelector(".nature-bt-left");
    const rightBtn = document.querySelector(".nature-bt-right");

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

        // ✅ Handle ghosting for play/pause & mute buttons
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
});

window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const images = document.querySelectorAll("img");
    let loadedImages = 0;

    function checkAllImagesLoaded() {
        loadedImages++;
        if (loadedImages === images.length) {
            removePreloader();
        }
    }

    function removePreloader() {
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
                document.body.style.overflow = "auto"; // Enable scrolling after load
            }, 500);
        }, 500); // Small delay for smoother transition
    }

    // If no images are found, just remove the preloader
    if (images.length === 0) {
        removePreloader();
    } else {
        images.forEach(img => {
            if (img.complete) {
                checkAllImagesLoaded(); // Image already loaded
            } else {
                img.addEventListener("load", checkAllImagesLoaded);
                img.addEventListener("error", checkAllImagesLoaded); // Handle broken images
            }
        });
    }
});

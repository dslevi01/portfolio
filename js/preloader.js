window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const images = document.querySelectorAll("img");
    let loadedImages = 0;
    let totalImages = images.length;
    let fontsLoaded = false;

    function checkAllLoaded() {
        if (loadedImages >= totalImages && fontsLoaded) {
            removePreloader();
        }
    }

    function removePreloader() {
        setTimeout(() => {
            preloader.style.opacity = "0";
            document.body.style.overflow = ""; // Reset overflow (fixes scrolling issue)
            document.documentElement.style.overflow = ""; // Ensure scrolling works on mobile
            setTimeout(() => {
                preloader.style.display = "none";
            }, 500);
        }, 500);
    }

    // If no images exist, skip image waiting
    if (totalImages === 0) {
        loadedImages = 1; // Prevent getting stuck
    } else {
        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
                checkAllLoaded();
            } else {
                img.addEventListener("load", () => {
                    loadedImages++;
                    checkAllLoaded();
                });
                img.addEventListener("error", () => {
                    loadedImages++; // Even failed images shouldn't block the loader
                    checkAllLoaded();
                });
            }
        });
    }

    // Wait for fonts to load
    document.fonts.ready.then(() => {
        fontsLoaded = true;
        checkAllLoaded();
    });

    // Ensure scrolling is disabled during preloading
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden"; // Fixes mobile issue
});

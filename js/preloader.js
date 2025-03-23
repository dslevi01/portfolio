document.addEventListener("DOMContentLoaded", function () {
    const texts = document.querySelectorAll(".loading-text");
    let index = 0;

    function showNextText() {
        texts.forEach(text => (text.style.display = "none")); // Hide all texts
        texts[index].style.display = "block"; // Show current text

        index = (index + 1) % texts.length;
        setTimeout(showNextText, 4500); // Change text every 4.5s
    }

    // Ensure first text is visible immediately
    if (texts.length > 0) {
        texts[0].style.display = "block";
        setTimeout(showNextText, 4500);
    }
});

window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const heroSection = document.getElementById("hero");
    const heroImages = heroSection.querySelectorAll("img");
    let loadedHeroImages = 0;
    let totalHeroImages = heroImages.length;
    let fontsLoaded = false;

    function checkHeroLoaded() {
        if (loadedHeroImages >= totalHeroImages && fontsLoaded) {
            removePreloader();
        }
    }

    function removePreloader() {
        setTimeout(() => {
            preloader.style.opacity = "0";
            document.documentElement.style.overflow = ""; // Enable scrolling
            document.body.style.overflow = "";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 500);
        }, 500);
    }

    // Prevent scrolling while loading
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    if (totalHeroImages === 0) {
        loadedHeroImages = 1;
    } else {
        heroImages.forEach(img => {
            if (img.complete) {
                loadedHeroImages++;
                checkHeroLoaded();
            } else {
                img.addEventListener("load", () => {
                    loadedHeroImages++;
                    checkHeroLoaded();
                });
                img.addEventListener("error", () => {
                    loadedHeroImages++;
                    checkHeroLoaded();
                });
            }
        });
    }

    document.fonts.ready.then(() => {
        fontsLoaded = true;
        checkHeroLoaded();
    });
});

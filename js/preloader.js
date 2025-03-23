window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const heroSection = document.getElementById("hero");
    const heroImages = heroSection.querySelectorAll("img");
    const texts = document.querySelectorAll(".loading-text");
    let loadedHeroImages = 0;
    let totalHeroImages = heroImages.length;
    let fontsLoaded = false;
    let index = 0;

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

    // Loading text cycling
    function showNextText() {
        if (preloader.style.opacity === "0") return; // Stop if preloader is removed

        texts.forEach(text => {
            text.style.opacity = "0";
            text.style.transform = "translateY(5px)";
        });

        texts[index].style.opacity = "1";
        texts[index].style.transform = "translateY(0px)";

        index = (index + 1) % texts.length;

        setTimeout(showNextText, 4500);
    }

    showNextText(); // Start cycling text
});

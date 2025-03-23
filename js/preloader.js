document.addEventListener("DOMContentLoaded", function () {
    const texts = document.querySelectorAll(".loading-text");
    let index = 0;

    function showNextText() {
        texts.forEach(text => text.style.opacity = "0"); // Start fading out all texts
        setTimeout(() => {
            texts.forEach(text => text.style.display = "none"); // Hide all texts after fade-out
            texts[index].style.display = "block"; // Show current text
            setTimeout(() => {
                texts[index].style.opacity = "1"; // Fade in current text
            }, 50); // Small delay for a smooth transition
        }, 500); // Fade-out duration (matches CSS)

        index = (index + 1) % texts.length;
        setTimeout(showNextText, 4500); // Change text every 4.5s
    }

    // Ensure first text is visible immediately
    if (texts.length > 0) {
        texts.forEach(text => {
            text.style.display = "none";
            text.style.opacity = "0";
        });
        texts[0].style.display = "block";
        setTimeout(() => (texts[0].style.opacity = "1"), 50);
        setTimeout(showNextText, 4500);
    }
});

// Disable scrolling function
function disableScroll() {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventArrowKeys, { passive: false });
}

// Enable scrolling function
function enableScroll() {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    window.removeEventListener("wheel", preventDefault);
    window.removeEventListener("touchmove", preventDefault);
    window.removeEventListener("keydown", preventArrowKeys);
}

// Prevent default scrolling behavior
function preventDefault(event) {
    event.preventDefault();
}

// Prevent arrow keys from scrolling
function preventArrowKeys(event) {
    if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault();
    }
}

window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const heroSection = document.getElementById("hero");
    const heroImages = heroSection.querySelectorAll("img");
    let loadedHeroImages = 0;
    let totalHeroImages = heroImages.length;
    let fontsLoaded = false;

    // Force the page to stay on #home
    location.hash = "home";

    function checkHeroLoaded() {
        if (loadedHeroImages >= totalHeroImages && fontsLoaded) {
            removePreloader();
        }
    }

    function removePreloader() {
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
                enableScroll(); // Allow scrolling only after the preloader is gone
            }, 500);
        }, 500);
    }

    disableScroll(); // Block scrolling from the start

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

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
        setTimeout(showNextText, 7000); // Change text every 7s
    }

    // Ensure first text is visible immediately
    if (texts.length > 0) {
        texts.forEach(text => {
            text.style.display = "none";
            text.style.opacity = "0";
        });
        texts[0].style.display = "block";
        setTimeout(() => (texts[0].style.opacity = "1"), 50);
        setTimeout(showNextText, 7000);
    }
});

// **Disable scrolling function**
function disableScroll() {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventArrowKeys, { passive: false });
}

// **Enable scrolling function**
function enableScroll() {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    window.removeEventListener("wheel", preventDefault);
    window.removeEventListener("touchmove", preventDefault);
    window.removeEventListener("keydown", preventArrowKeys);
}

// **Prevent default scrolling behavior**
function preventDefault(event) {
    event.preventDefault();
}

// **Prevent arrow keys from scrolling**
function preventArrowKeys(event) {
    if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault();
    }
}

// **Force the page to stay on #home**
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const heroImage = document.querySelector("#hero img[src*='hero2.png']");

    location.hash = "home";
    disableScroll(); // Make sure scrolling is blocked from the very start!

    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    function checkLoaded() {
        if (heroImage?.complete) {
            removePreloader();
        }
    }

    function removePreloader() {
        setTimeout(() => {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
                enableScroll(); // Allow scrolling ONLY AFTER the preloader fully disappears
            }, 500);
        }, 500);
    }

    // Check if hero2.png is already loaded
    if (heroImage) {
        if (heroImage.complete) {
            checkLoaded();
        } else {
            heroImage.addEventListener("load", checkLoaded);
            heroImage.addEventListener("error", checkLoaded); // In case it fails to load
        }
    } else {
        console.warn("hero2.png not found!");
    }

});

document.addEventListener("DOMContentLoaded", function () {
    const texts = document.querySelectorAll(".loading-text");
    let index = 0;

    function showNextText() {
        texts.forEach(text => text.classList.remove("active"));
        setTimeout(() => {
            texts.forEach(text => text.style.display = "none"); // Hide all texts
            texts[index].style.display = "block";
            texts[index].classList.add("active"); // Fade in the next text
        }, 500); // Matches CSS transition

        index = (index + 1) % texts.length;
        setTimeout(showNextText, 7000); // Change text every 7s
    }

    // Ensure the first text appears immediately without delay
    if (texts.length > 0) {
        texts[0].style.display = "block"; // Show the first text immediately
        texts[0].classList.add("active"); // Apply fade-in immediately
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

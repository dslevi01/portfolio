window.addEventListener("DOMContentLoaded", function () {
    if (window.location.hash) {
        history.replaceState(null, null, " "); // Remove hash from URL on page load
    }
    document.getElementById("home").scrollIntoView({ behavior: "instant" }); // Scroll to home
});

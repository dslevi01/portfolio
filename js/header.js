document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-button");
    const menu = document.getElementById("menu");
    const menuToggle = document.getElementById("menu-toggle");
    
    if (!menuButton || !menu) return; // Ensure elements exist

    // Store initial button position
    const initialTop = menuButton.getBoundingClientRect().top + window.scrollY; 

    menuButton.addEventListener("click", function () {
        document.body.classList.toggle("menu-open"); // Toggle class

        // When menu is open, force button to be red
        if (document.body.classList.contains("menu-open")) {
            menuButton.style.background = "var(--red)";
            menuButton.style.opacity = "1";
        } else {
            updateButtonStyle(); // Reapply scroll effect
        }
    });

    function updateButtonStyle() {
        const currentTop = menuButton.getBoundingClientRect().top + window.scrollY;

        if (document.body.classList.contains("menu-open")) {
            menuButton.style.background = "var(--red)";
            menuButton.style.opacity = "1";
        } else if (currentTop > initialTop) {
            menuButton.style.background = "transparent";
            menuButton.style.opacity = "0.75";
        } else {
            menuButton.style.background = "var(--yellow)";
            menuButton.style.opacity = "1";
        }
    }

    // Listen for scroll
    window.addEventListener("scroll", updateButtonStyle);

    updateButtonStyle(); // Run on page load
});

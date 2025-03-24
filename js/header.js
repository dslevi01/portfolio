document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-button");
    const menu = document.getElementById("menu");
    const menuItems = document.querySelectorAll(".menu-item"); // Select all menu items
    
    if (!menuButton || !menu) return; // Ensure elements exist

    let initialTop; // Declare initialTop variable

    function updateInitialTop() {
        initialTop = menuButton.getBoundingClientRect().top + window.scrollY;
        updateButtonStyle(); // Ensure button updates immediately
    }

    window.addEventListener("load", updateInitialTop); // Update on full page load
    window.addEventListener("resize", updateInitialTop); // Update if screen size changes

    menuButton.addEventListener("click", function (event) {
        document.body.classList.toggle("menu-open"); // Toggle class

        // When menu is open, force button to be red
        if (document.body.classList.contains("menu-open")) {
            menuButton.style.background = "var(--red)";
            menuButton.style.opacity = "1";
        } else {
            updateButtonStyle(); // Reapply scroll effect
        }

        event.stopPropagation(); // Prevent click from triggering the document listener
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

    // Close menu when an item is clicked
    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            document.body.classList.remove("menu-open");
            updateButtonStyle(); // Ensure button color updates
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
            document.body.classList.remove("menu-open");
            updateButtonStyle();
        }
    });
});

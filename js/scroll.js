window.addEventListener("DOMContentLoaded", function () {
    if (window.location.hash) {
        history.replaceState(null, null, " "); // Remove hash from URL on page load
    }
    document.getElementById("home").scrollIntoView({ behavior: "instant" }); // Scroll to home
});


document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior

            const targetId = this.getAttribute("data-target");
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });
});
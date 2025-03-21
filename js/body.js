const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
};

// Apply saved mode on page load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
});

// Example: Button to toggle dark mode
document.querySelector("#dark-mode-toggle").addEventListener("click", toggleDarkMode);

document.addEventListener("DOMContentLoaded", () => {
    const sketchesProject = document.querySelector(".sketches-project");
    if (!sketchesProject) return; // Stop if the project isn't found

    const counters = sketchesProject.querySelectorAll(".sketches-counter");
    const images = sketchesProject.querySelectorAll(".sketches-image");
    const plusButton = sketchesProject.querySelector(".plus-bt");
    const minusButton = sketchesProject.querySelector(".minus-bt");

    function updateCounter() {
        const activeCount = Array.from(images).filter(img => img.dataset.active === "true").length;

        counters.forEach((counter, index) => {
            counter.src = index < activeCount
                ? "assets/counter-fill.svg"
                : "assets/counter-nofill.svg";
        });
    }

    // Listen for activation/deactivation
    plusButton?.addEventListener("click", () => {
        setTimeout(updateCounter, 10); // Slight delay to sync with other scripts
    });

    minusButton?.addEventListener("click", () => {
        setTimeout(updateCounter, 10);
    });

    updateCounter(); // Initialize on load
});

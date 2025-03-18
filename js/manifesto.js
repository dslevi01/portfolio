document.addEventListener("DOMContentLoaded", function () {
    const lines = document.querySelectorAll(".manifesto-line");
    const appearThreshold = .8;  // Appears when reaching 85% of the viewport (near bottom)
    const disappearThreshold = 0.10; // Disappears when reaching 75% of the viewport (higher up)

    function checkVisibility() {
        const viewportHeight = window.innerHeight;

        lines.forEach((line) => {
            const rect = line.getBoundingClientRect();
            const shouldAppear = rect.bottom < viewportHeight * appearThreshold;
            const shouldDisappear = rect.bottom < viewportHeight * disappearThreshold;

            if (shouldAppear) {
                line.classList.add("visible");
            } 
            if (shouldDisappear) {
                line.classList.remove("visible");
            }
        });
    }

    window.addEventListener("scroll", checkVisibility);
    checkVisibility(); // Run on page load
});

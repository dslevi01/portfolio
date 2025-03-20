document.addEventListener("DOMContentLoaded", function () {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);

    let touchTimeout;

    document.querySelectorAll("img[aria-label]").forEach(img => {
        // Mouse events (for non-touch users)
        img.addEventListener("mouseenter", (e) => {
            if (!isTouchDevice()) {
                updateTooltip(img, e);
                tooltip.style.display = "block";
            }
        });

        img.addEventListener("mousemove", (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        img.addEventListener("mouseleave", () => {
            if (!isTouchDevice()) {
                tooltip.style.display = "none";
            }
        });

        // Touch events (for touch users)
        img.addEventListener("touchstart", (e) => {
            updateTooltip(img, e.touches[0]); // Use the first touch point
            tooltip.style.display = "block";

            // Hide tooltip after 5 seconds
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                tooltip.style.display = "none";
            }, 1200);
        });

        img.addEventListener("touchend", () => {
            // Optional: Hide immediately when touch ends
            // tooltip.style.display = "none";
        });

        // Observer to update tooltip if aria-label changes dynamically
        const observer = new MutationObserver(() => {
            if (tooltip.style.display === "block") {
                tooltip.textContent = img.getAttribute("aria-label");
            }
        });

        observer.observe(img, { attributes: true, attributeFilter: ["aria-label"] });
    });

    function updateTooltip(img, e) {
        const labelText = img.getAttribute("aria-label");
        if (labelText) {
            tooltip.textContent = labelText;
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    }

    function isTouchDevice() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }
});

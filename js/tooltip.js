document.addEventListener("DOMContentLoaded", function () {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);

    document.querySelectorAll("img[aria-label]").forEach(img => {
        img.addEventListener("mouseenter", (e) => {
            updateTooltip(img, e);
            tooltip.style.display = "block";
        });

        img.addEventListener("mousemove", (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        img.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
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
});

document.addEventListener("DOMContentLoaded", function () {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);

    document.querySelectorAll("img[alt]").forEach(img => {
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

        // Observer to update tooltip if alt text changes dynamically
        const observer = new MutationObserver(() => {
            if (tooltip.style.display === "block") {
                tooltip.textContent = img.getAttribute("alt");
            }
        });

        observer.observe(img, { attributes: true, attributeFilter: ["alt"] });
    });

    function updateTooltip(img, e) {
        const altText = img.getAttribute("alt");
        if (altText) {
            tooltip.textContent = altText;
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    }
});

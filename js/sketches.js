document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".sketches-frame");
    const mediaImages = document.querySelectorAll(".sketches-media .sketches-image");

    let addedImages = []; // Track added images in order

    document.querySelector(".plus-bt")?.addEventListener("click", activateRandomImage);
    document.querySelector(".minus-bt")?.addEventListener("click", deactivateLastImage);


    mediaImages.forEach(img => {
        img.addEventListener("click", () => trackExpandedImage(img));
        img.addEventListener("touchstart", (event) => {
            event.preventDefault(); // Prevents long-press menu
            trackExpandedImage(img);
        });
    });
    
    function trackExpandedImage(img) {
        // If the image is already expanded, do nothing
        if (img.classList.contains("expanded")) return;
    
        // Move the expanded image to the end of addedImages to track it correctly
        addedImages = addedImages.filter(i => i !== img); // Remove if already in the array
        addedImages.push(img); // Re-add to mark it as the most recent
    }

    function setRandomPosition(img) {
        let maxX = container.offsetWidth - img.offsetWidth;
        let maxY = container.offsetHeight - img.offsetHeight;

        let randomX = Math.random() * maxX;
        let randomY = Math.random() * maxY;

        img.style.left = `${randomX}px`;
        img.style.top = `${randomY}px`;
    }

    function keepInsideBounds(img) {
        let maxX = container.offsetWidth - img.offsetWidth;
        let maxY = container.offsetHeight - img.offsetHeight;

        let currentX = parseFloat(img.style.left);
        let currentY = parseFloat(img.style.top);

        if (currentX < 0) img.style.left = `0px`;
        if (currentY < 0) img.style.top = `0px`;
        if (currentX > maxX) img.style.left = `${maxX}px`;
        if (currentY > maxY) img.style.top = `${maxY}px`;
    }

    function activateRandomImage() {
        const inactiveImages = [...mediaImages].filter(img => img.dataset.active !== "true");

        if (inactiveImages.length === 0) return;

        const selectedImage = inactiveImages[Math.floor(Math.random() * inactiveImages.length)];

        selectedImage.classList.add("active");
        selectedImage.dataset.active = "true";
        addedImages.push(selectedImage); // Track added images

        setRandomPosition(selectedImage);

        // ✅ Ensure last added image is on top
        selectedImage.style.zIndex = addedImages.length;
    }

    
    function deactivateLastImage() {
        if (addedImages.length === 0) return;
    
        // Find the last added image that is expanded
        let lastAddedExpanded = [...addedImages].reverse().find(img => img.classList.contains("expanded"));
    
        if (lastAddedExpanded) {
            document.dispatchEvent(new CustomEvent("deactivateImage", { detail: { image: lastAddedExpanded } }));
            lastAddedExpanded.classList.remove("expanded", "active");
            lastAddedExpanded.dataset.active = "false";
            addedImages = addedImages.filter(img => img !== lastAddedExpanded);
        } else {
            // Otherwise, remove the last added image normally
            const lastAdded = addedImages.pop();
            lastAdded.classList.remove("active");
            lastAdded.dataset.active = "false";
        }
    
        // ✅ Check if any expanded images remain, reset blur if none exist
        if (!document.querySelector(".sketches-image.expanded")) {
            document.querySelector(".sketches-media").classList.remove("expanding");
        }
    }
    
    

    function resetImage(img) {
        img.classList.remove("expanded");

        setTimeout(() => {
            img.style.zIndex = "1";
            img.classList.remove("no-blur");

            if (!document.querySelector(".sketches-image.expanded")) {
                container.classList.remove("expanding");
            }
        }, 300);
    }

    window.addEventListener("resize", () => {
        document.querySelectorAll(".sketches-image.active").forEach(keepInsideBounds);
    });
});

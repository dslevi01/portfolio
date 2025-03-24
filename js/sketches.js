document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".sketches-frame");
    const mediaImages = document.querySelectorAll(".sketches-media .sketches-image");

    let addedImages = []; // Track added images in order

    document.querySelector(".plus-bt")?.addEventListener("click", activateRandomImage);
    document.querySelector(".minus-bt")?.addEventListener("click", deactivateLastImage);

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
        let expandedImage = document.querySelector(".sketches-image.expanded");

        if (expandedImage) {
            document.dispatchEvent(new CustomEvent("deactivateImage", { detail: { image: expandedImage } }));
            expandedImage.classList.remove("active");
            expandedImage.dataset.active = "false";
            addedImages = addedImages.filter(img => img !== expandedImage);
            return;
        }

        if (addedImages.length === 0) return;

        const lastAdded = addedImages.pop();
        lastAdded.classList.remove("active");
        lastAdded.dataset.active = "false";
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

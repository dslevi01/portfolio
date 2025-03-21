document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".sketches-frame");
    const mediaImages = document.querySelectorAll(".sketches-media .sketches-image");
    
    let isDragging = false; // Prevent page scrolling when dragging

    document.querySelector(".plus-bt")?.addEventListener("click", activateRandomImage);
    document.querySelector(".minus-bt")?.addEventListener("click", deactivateRandomImage);

    function setRandomPosition(img) {
        let maxX = container.offsetWidth - img.offsetWidth;
        let maxY = container.offsetHeight - img.offsetHeight;

        let randomX = Math.random() * maxX;
        let randomY = Math.random() * maxY;

        img.style.left = `${randomX}px`;
        img.style.top = `${randomY}px`;
    }

    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        elmnt.addEventListener("pointerdown", dragStart);

        function dragStart(e) {
            e.preventDefault();
            isDragging = true;
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.addEventListener("pointermove", dragMove);
            document.addEventListener("pointerup", dragEnd);
        }

        function dragMove(e) {
            if (!isDragging) return;
            e.preventDefault();

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newX = elmnt.offsetLeft - pos1;
            let newY = elmnt.offsetTop - pos2;

            elmnt.style.left = `${newX}px`;
            elmnt.style.top = `${newY}px`;

            keepInsideBounds(elmnt);
        }

        function dragEnd() {
            isDragging = false;
            document.removeEventListener("pointermove", dragMove);
            document.removeEventListener("pointerup", dragEnd);
        }
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
        const inactiveImages = [...mediaImages].filter(img => img.dataset.active === "false");

        if (inactiveImages.length === 0) return;

        const selectedImage = inactiveImages[Math.floor(Math.random() * inactiveImages.length)];

        selectedImage.classList.add("active");
        selectedImage.dataset.active = "true";

        setRandomPosition(selectedImage);
        dragElement(selectedImage);
    }

    function deactivateRandomImage() {
        const activeImages = [...mediaImages].filter(img => img.dataset.active === "true");

        if (activeImages.length === 0) return;

        const selectedImage = activeImages[Math.floor(Math.random() * activeImages.length)];

        selectedImage.classList.remove("active");
        selectedImage.dataset.active = "false";
    }

    window.addEventListener("resize", () => {
        document.querySelectorAll(".sketches-image.active").forEach(keepInsideBounds);
    });

    // Prevent scrolling while dragging
    document.addEventListener("touchmove", function (e) {
        if (isDragging) e.preventDefault();
    }, { passive: false });
});

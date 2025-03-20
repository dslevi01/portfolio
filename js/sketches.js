document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".sketches-frame");
    const mediaImages = document.querySelectorAll(".sketches-media .sketches-image");

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
    
        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragTouchStart; // Touch support
    
        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
    
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
    
        function dragTouchStart(e) {
            e.preventDefault(); // Prevent scrolling
            let touch = e.touches[0]; // Get first touch point
            pos3 = touch.clientX;
            pos4 = touch.clientY;
    
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementTouchDrag;
        }
    
        function elementDrag(e) {
            e.preventDefault();
            moveElement(e.clientX, e.clientY);
        }
    
        function elementTouchDrag(e) {
            e.preventDefault();
            let touch = e.touches[0]; // Get updated touch point
            moveElement(touch.clientX, touch.clientY);
        }
    
        function moveElement(clientX, clientY) {
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;
    
            let newX = elmnt.offsetLeft - pos1;
            let newY = elmnt.offsetTop - pos2;
    
            let maxX = container.offsetWidth - elmnt.offsetWidth;
            let maxY = container.offsetHeight - elmnt.offsetHeight;
    
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
    
            elmnt.style.left = `${newX}px`;
            elmnt.style.top = `${newY}px`;
        }
    
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    }
    

    function activateRandomImage() {
        const inactiveImages = Array.from(mediaImages).filter(img => img.dataset.active === "false");

        if (inactiveImages.length === 0) return; // No more images to activate

        const randomIndex = Math.floor(Math.random() * inactiveImages.length);
        const selectedImage = inactiveImages[randomIndex];

        selectedImage.classList.add("active");
        selectedImage.dataset.active = "true";

        setRandomPosition(selectedImage);
        dragElement(selectedImage);
    }

    function deactivateRandomImage() {
        const activeImages = Array.from(mediaImages).filter(img => img.dataset.active === "true");

        if (activeImages.length === 0) return; // No active images to remove

        const randomIndex = Math.floor(Math.random() * activeImages.length);
        const selectedImage = activeImages[randomIndex];

        selectedImage.classList.remove("active");
        selectedImage.dataset.active = "false";
    }

    window.addEventListener("resize", () => {
        document.querySelectorAll(".sketches-image.active").forEach(img => {
            setRandomPosition(img);
        });
    });
});
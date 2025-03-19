document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".project-dropdown-bt").forEach(button => {
        button.addEventListener("click", function () {
            const dropdown = this.closest(".project-frame").querySelector(".project-dropdown");
            const leftButton = this.closest(".project-frame").parentElement.querySelector(".bt-left img");
            const rightButton = this.closest(".project-frame").parentElement.querySelector(".bt-right img");
            const dropdownArrow = this.querySelector("img.top-arrow");
            const container = dropdown.querySelector(".media-container");
            const mediaItems = Array.from(container.children);
            let currentIndex = dropdown.dataset.currentIndex ? parseInt(dropdown.dataset.currentIndex, 10) : 0;

            dropdown.classList.toggle("open");
            this.querySelector(".top-arrow").style.transform = dropdown.classList.contains("open") ? "rotate(0deg)" : "rotate(180deg)";

            function updateButtonStates() {
                leftButton.src = currentIndex === 0 ? "assets/ghost.svg" : "assets/arrow.svg";
                leftButton.parentElement.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
                
                rightButton.src = currentIndex === mediaItems.length - 1 ? "assets/ghost.svg" : "assets/arrow.svg";
                rightButton.parentElement.style.pointerEvents = currentIndex === mediaItems.length - 1 ? "none" : "auto";
            }

            function scrollToMedia(index) {
                if (index < 0 || index >= mediaItems.length) return;
                currentIndex = index;
                dropdown.dataset.currentIndex = currentIndex; // Save current index
                mediaItems[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                updateButtonStates();
            }

            leftButton.parentElement.addEventListener("click", () => scrollToMedia(currentIndex - 1));
            rightButton.parentElement.addEventListener("click", () => scrollToMedia(currentIndex + 1));

            if (!dropdown.classList.contains("open")) {
                leftButton.src = "assets/ghost.svg";
                rightButton.src = "assets/ghost.svg";
                leftButton.parentElement.style.pointerEvents = "none";
                rightButton.parentElement.style.pointerEvents = "none";
                dropdownArrow.setAttribute("aria-label", "open");
            } else {
                updateButtonStates();
                dropdownArrow.setAttribute("aria-label", "close");
                scrollToMedia(currentIndex); // Restore position on open
            }
        });
    });
});

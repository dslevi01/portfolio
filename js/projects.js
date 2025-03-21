document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".project-dropdown-bt").forEach(button => {
        button.addEventListener("click", function () {
            const projectFrame = this.closest(".project-frame");
            if (!projectFrame) return;

            const dropdown = projectFrame.querySelector(".project-dropdown");
            const dropdownArrow = this.querySelector("img.top-arrow");
            const container = dropdown?.querySelector(".media-container");
            const mediaItems = container ? Array.from(container.children) : [];
            let currentIndex = dropdown?.dataset.currentIndex ? parseInt(dropdown.dataset.currentIndex, 10) : 0;

            // ✅ Ensure left and right buttons exist before using them
            const leftButton = projectFrame.parentElement?.querySelector(".bt-left img");
            const rightButton = projectFrame.parentElement?.querySelector(".bt-right img");

            // ✅ Select plus and minus buttons inside the specific dropdown
            const plusButton = projectFrame.querySelector(".plus-bt img");
            const minusButton = projectFrame.querySelector(".minus-bt img");

            dropdown.classList.toggle("open");
            dropdownArrow.style.transform = dropdown.classList.contains("open") ? "rotate(0deg)" : "rotate(180deg)";
            dropdownArrow.setAttribute("aria-label", dropdown.classList.contains("open") ? "close" : "open");

            function updateButtonStates() {
                if (!leftButton || !rightButton) return; // Prevent null errors

                leftButton.src = currentIndex === 0 ? "assets/ghost.svg" : "assets/arrow.svg";
                leftButton.parentElement.style.pointerEvents = currentIndex === 0 ? "none" : "auto";

                rightButton.src = currentIndex === mediaItems.length - 1 ? "assets/ghost.svg" : "assets/arrow.svg";
                rightButton.parentElement.style.pointerEvents = currentIndex === mediaItems.length - 1 ? "none" : "auto";
            }

            function centerProjectFrame() {
                projectFrame.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }

            function scrollToMedia(index) {
                if (!mediaItems.length || index < 0 || index >= mediaItems.length) return;
                currentIndex = index;
                dropdown.dataset.currentIndex = currentIndex;
                mediaItems[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                updateButtonStates();
                centerProjectFrame();
            }

            // ✅ Only add event listeners if the buttons exist
            if (leftButton?.parentElement) {
                leftButton.parentElement.addEventListener("click", () => scrollToMedia(currentIndex - 1));
            }
            if (rightButton?.parentElement) {
                rightButton.parentElement.addEventListener("click", () => scrollToMedia(currentIndex + 1));
            }

            // ✅ Apply ghost/inactive state to plus and minus buttons when dropdown is closed
            if (!dropdown.classList.contains("open")) {
                if (leftButton) {
                    leftButton.src = "assets/ghost.svg";
                    leftButton.parentElement.style.pointerEvents = "none";
                }
                if (rightButton) {
                    rightButton.src = "assets/ghost.svg";
                    rightButton.parentElement.style.pointerEvents = "none";
                }
                if (plusButton) {
                    plusButton.src = "assets/ghost.svg";
                    plusButton.parentElement.style.pointerEvents = "none";
                }
                if (minusButton) {
                    minusButton.src = "assets/ghost.svg";
                    minusButton.parentElement.style.pointerEvents = "none";
                }
            } else {
                updateButtonStates();
                centerProjectFrame();
                scrollToMedia(currentIndex);

                // ✅ Make plus and minus buttons active again when dropdown opens
                if (plusButton) {
                    plusButton.src = "assets/plus.svg";
                    plusButton.parentElement.style.pointerEvents = "auto";
                }
                if (minusButton) {
                    minusButton.src = "assets/minus.svg";
                    minusButton.parentElement.style.pointerEvents = "auto";
                }
            }
        });
    });
});

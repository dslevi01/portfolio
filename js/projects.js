document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".project-dropdown-bt").forEach(button => {
        button.addEventListener("click", function () {
            const dropdown = this.closest(".project-frame").querySelector(".project-dropdown");
            const leftButton = this.closest(".project-frame").parentElement.querySelector(".bt-left img");
            const rightButton = this.closest(".project-frame").parentElement.querySelector(".bt-right img");
            const dropdownArrow = this.querySelector("img.top-arrow");
            
            dropdown.classList.toggle("open");
            
            this.querySelector(".top-arrow").style.transform = dropdown.classList.contains("open") ? "rotate(0deg)" : "rotate(180deg)";


            // Toggle button states based on dropdown state
            if (dropdown.classList.contains("open")) {
                leftButton.src = "assets/arrow.svg";
                rightButton.src = "assets/arrow.svg";
                leftButton.parentElement.style.pointerEvents = "auto";
                rightButton.parentElement.style.pointerEvents = "auto";
                dropdownArrow.alt = "close";
            } else {
                leftButton.src = "assets/ghost.svg";
                rightButton.src = "assets/ghost.svg";
                leftButton.parentElement.style.pointerEvents = "none";
                rightButton.parentElement.style.pointerEvents = "none";
                dropdownArrow.alt = "open";
            }
        });
    });
});


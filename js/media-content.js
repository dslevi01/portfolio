document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to all dropdown buttons
    const dropdownButtons = document.querySelectorAll('.project-dropdown-bt');
    
    dropdownButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dropdown = button.closest('.project-frame').querySelector('.project-dropdown');
            
            // When dropdown is closed (doesn't have 'open' class)
            if (!dropdown.classList.contains('open')) {
                // Find all YouTube iframes in this dropdown
                const videos = dropdown.querySelectorAll('iframe[src*="youtube.com"]');
                
                // Pause each video by posting a message
                videos.forEach(video => {
                    video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                });
            }
        });
    });

    const mediaContainers = document.querySelectorAll('.media-container');

    mediaContainers.forEach(container => {
        // Set up flex container
        container.style.display = 'flex';
        container.style.transition = 'transform 0.5s ease';

        const mediaItems = container.children;
        const itemCount = mediaItems.length;
        const dropdown = container.closest('.project-dropdown');
        const counterContainer = dropdown.querySelector('.media-counter');
        const descriptionContainer = dropdown.querySelector('.project-description');
        
        // Adjust number of counters to match content
        while (counterContainer.children.length > itemCount) {
            counterContainer.removeChild(counterContainer.lastChild);
        }
        while (counterContainer.children.length < itemCount) {
            const newCounter = document.createElement('img');
            newCounter.className = 'counter';
            newCounter.src = 'assets/counter-nofill.svg';
            counterContainer.appendChild(newCounter);
        }

        const counters = counterContainer.querySelectorAll('.counter');
        const prevButton = container.closest('.project').querySelector('.bt-left');
        const nextButton = container.closest('.project').querySelector('.bt-right');
        
        let currentIndex = 0;
        let isAnimating = false;

        // Keep original content width, just set container width
        const totalWidth = Array.from(mediaItems).reduce((sum, item) => {
            // Get actual rendered width including gap
            const style = window.getComputedStyle(item);
            const marginRight = parseInt(style.marginRight) || 0;
            return sum + item.offsetWidth + marginRight;
        }, 0);

        container.style.width = `${totalWidth}px`;

        function updateCounters() {
            counters.forEach((counter, index) => {
                counter.src = index === currentIndex ? 
                    'assets/counter-fill.svg' : 
                    'assets/counter-nofill.svg';
            });
        }

        function updateDescription() {
            if (descriptionContainer) {
                // Hide all descriptions first
                descriptionContainer.querySelectorAll('p')
                    .forEach(desc => desc.style.display = 'none');
                
                // Show the current description
                const currentDesc = descriptionContainer.querySelector(
                    `p:nth-child(${currentIndex + 1})`
                );
                if (currentDesc) {
                    currentDesc.style.display = 'block';
                }
            }
        }

        function navigate(direction) {
            if (isAnimating) return;
            isAnimating = true;

            currentIndex = (currentIndex + direction + itemCount) % itemCount;
            const offset = Array.from(mediaItems)
                .slice(0, currentIndex)
                .reduce((sum, item) => sum + item.offsetWidth, 0);

            container.style.transform = `translateX(-${offset}px)`;
            updateCounters();
            updateDescription();

            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }

        // Add click handlers
        if (prevButton) {
            prevButton.addEventListener('click', () => navigate(-1));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => navigate(1));
        }

        // Initialize position, counters and description
        container.style.transform = 'translateX(0)';
        updateCounters();
        updateDescription();

        // Handle transition end
        container.addEventListener('transitionend', () => {
            isAnimating = false;
        });
    });
});
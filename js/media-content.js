document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.game-project').forEach((project) => {
        const container = project.querySelector('.media-container');
        const mediaItems = Array.from(container.children);
        const counterContainer = project.querySelector('.media-counter');
        const descriptionContainer = project.querySelector('.project-description');
        const counters = counterContainer.querySelectorAll('.counter');
        const prevButton = project.querySelector('.bt-left');
        const nextButton = project.querySelector('.bt-right');
        const dropdown = project.querySelector('.project-dropdown');
        const dropdownButton = project.querySelector('.project-bt-dropdown');
        const navigationButtons = [prevButton, nextButton];

        let currentIndex = 0;
        let ytPlayers = [];

        function updateUI() {
            counters.forEach((counter, index) => {
                counter.src = index === currentIndex 
                    ? 'assets/counter-fill.svg' 
                    : 'assets/counter-nofill.svg';
            });

            if (descriptionContainer) {
                descriptionContainer.querySelectorAll('p').forEach((desc, index) => {
                    desc.style.display = index === currentIndex ? 'block' : 'none';
                });
            }
        }

        function scrollToMedia(index) {
            if (index < 0 || index >= mediaItems.length) return;
            const target = mediaItems[index];

            if (target) {
                container.scrollTo({ left: target.offsetLeft - container.offsetLeft, behavior: 'smooth' });
                currentIndex = index;
                updateUI();
            }
        }

        function findVisibleMedia() {
            let closestIndex = 0;
            let minOffset = Infinity;

            mediaItems.forEach((item, index) => {
                const offset = Math.abs(item.getBoundingClientRect().left - container.getBoundingClientRect().left);
                if (offset < minOffset) {
                    minOffset = offset;
                    closestIndex = index;
                }
            });

            if (closestIndex !== currentIndex) {
                currentIndex = closestIndex;
                updateUI();
            }
        }

        container.addEventListener('scroll', () => {
            clearTimeout(container.scrollTimeout);
            container.scrollTimeout = setTimeout(findVisibleMedia, 100);
        });

        prevButton.addEventListener('click', () => scrollToMedia(currentIndex - 1));
        nextButton.addEventListener('click', () => scrollToMedia(currentIndex + 1));

        function onYouTubeIframeAPIReady() {
            const iframes = container.querySelectorAll('iframe');
            iframes.forEach((iframe, index) => {
                const player = new YT.Player(iframe, {
                    events: {
                        'onReady': () => ytPlayers[index] = player
                    }
                });
            });
        }

        function pauseAllVideos() {
            ytPlayers.forEach(player => player?.pauseVideo());
        }

        // Pause videos when .project-bt-dropdown, .bt-left, or .bt-right is clicked
        if (dropdownButton) {
            dropdownButton.addEventListener('click', pauseAllVideos);
        }
        navigationButtons.forEach(button => {
            if (button) button.addEventListener('click', pauseAllVideos);
        });

        const observer = new MutationObserver(() => {
            if (!dropdown.classList.contains('open')) {
                pauseAllVideos();
            }
        });

        observer.observe(dropdown, { attributes: true, attributeFilter: ['class'] });

        if (document.querySelector('iframe[src*="youtube.com"]')) {
            if (!window.YT) {
                const script = document.createElement('script');
                script.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(script);
            } else {
                onYouTubeIframeAPIReady();
            }
        }

        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        updateUI();
    });
});

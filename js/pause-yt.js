document.addEventListener('DOMContentLoaded', () => {
    let ytPlayers = [];

    function setupYouTubePlayers() {
        document.querySelectorAll('.project-video').forEach((iframe, index) => {
            const url = new URL(iframe.src);

            // Ensure enablejsapi=1 is set BEFORE player initialization
            if (!url.searchParams.has("enablejsapi")) {
                url.searchParams.set("enablejsapi", "1");
                iframe.src = url.toString();
            }

            // Wait for iframe to reload before initializing player
            iframe.onload = () => {
                ytPlayers[index] = new YT.Player(iframe, {
                    events: {
                        'onReady': (event) => {
                            ytPlayers[index] = event.target;
                        }
                    }
                });
            };
        });
    }

    // Load YouTube API dynamically (only once)
    if (!window.YT) {
        const script = document.createElement('script');
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => {
            if (typeof setupYouTubePlayers === 'function') {
                setupYouTubePlayers();
            }
        };
        document.head.appendChild(script);
    } else {
        setupYouTubePlayers();
    }

    // Pause all YouTube videos
    function pauseAllVideos() {
        ytPlayers.forEach(player => {
            if (player && typeof player.pauseVideo === "function") {
                player.pauseVideo();
            }
        });
    }

    // Watch for counter changes to pause videos
    document.querySelectorAll('.media-counter .counter').forEach(counter => {
        const observer = new MutationObserver(() => {
            pauseAllVideos();
        });

        observer.observe(counter, { attributes: true, attributeFilter: ['src'] });
    });

    // Pause videos when clicking any .project-bt button
    document.querySelectorAll('.project-bt').forEach(button => {
        button.addEventListener('click', pauseAllVideos);
    });
});

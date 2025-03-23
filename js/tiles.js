document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("tileGrid");
    let tiles = []; // Store created tiles

    function shouldEnableGrid() {
        return window.innerWidth >= 1065;
    }

    function setupTileConfig() {
        const isMobile = window.innerWidth < 768;

        return {
            isMobile,
            horizontalSizes: isMobile 
                ? ['size1x1', 'size1x2'] 
                : ['size1x2', 'size1x3', 'size2x1', 'size3x1'],
            verticalSizes: isMobile 
                ? ['size1x1', 'size2x2'] 
                : ['size1x1', 'size2x2', 'size2x3'],
            colors: [
                ...Array(20).fill('yellow'),
                ...Array(20).fill('green'),
                ...Array(20).fill('red'),
                ...Array(10).fill('yellow-d'),
                ...Array(10).fill('green-d'),
                ...Array(10).fill('red-d'),
                ...Array(5).fill('dark'),
                ...Array(5).fill('nofill')
            ],
            maxTiles: isMobile ? 80 : 138
        };
    }

    function createTile(config) {
        const tile = document.createElement('div');
        tile.classList.add('tile');

        const isHorizontal = config.isMobile ? Math.random() < 0.5 : Math.random() < 0.7;
        const chosenSize = isHorizontal 
            ? config.horizontalSizes[Math.floor(Math.random() * config.horizontalSizes.length)]
            : config.verticalSizes[Math.floor(Math.random() * config.verticalSizes.length)];

        tile.classList.add(chosenSize, config.colors[Math.floor(Math.random() * config.colors.length)]);
        return tile;
    }

    function fillGrid() {
        const config = setupTileConfig();
        const fragment = document.createDocumentFragment();

        if (tiles.length === 0) {
            // Generate new tiles only if they haven't been created before
            for (let i = 0; i < config.maxTiles; i++) {
                const tile = createTile(config);
                tiles.push(tile);
                fragment.appendChild(tile);
            }
        } else {
            // Restore existing tiles
            tiles.forEach(tile => fragment.appendChild(tile));
        }

        grid.appendChild(fragment);
    }

    function updateTilesOnScroll() {
        const scrollY = window.scrollY + window.innerHeight;
        document.querySelectorAll(".tile").forEach(tile => {
            const tileTop = tile.offsetTop;
            const progress = (scrollY - tileTop) / window.innerHeight;

            if (progress > 0 && !tile.classList.contains("snapped")) {
                const baseDelay = progress * 100;
                const randomExtraDelay = Math.random() * 300;
                tile.style.transitionDelay = `${Math.min(baseDelay, 200) + randomExtraDelay}ms`;
                tile.classList.add("snapped");
            }
        });
    }

    // Throttle scroll event
    let lastExecution = 0;
    function throttledScroll() {
        const now = performance.now();
        if (now - lastExecution > 100) { 
            updateTilesOnScroll();
            lastExecution = now;
        }
    }

    function toggleGrid() {
        if (shouldEnableGrid()) {
            if (!grid.classList.contains("visible")) {
                grid.classList.add("visible");
                fillGrid(); // Restore or generate grid
                window.addEventListener("scroll", throttledScroll);
            }
        } else {
            grid.classList.remove("visible");
            window.removeEventListener("scroll", throttledScroll);
        }
    }

    // Intersection Observer to load tiles when section is visible
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            toggleGrid(); 
            observer.disconnect();
        }
    }, { threshold: 0.1 });

    observer.observe(grid);

    // Watch for window resize and toggle grid dynamically
    window.addEventListener("resize", toggleGrid);

    // Initial grid check on page load
    toggleGrid();
});

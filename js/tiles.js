document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("tileGrid");

    const horizontalSizes = ['size1x2', 'size1x3', 'size2x1', 'size3x1']; // More horizontal
    const verticalSizes = ['size1x1', 'size2x2', 'size2x3']; // Less vertical

    const colors = [
        ...Array(20).fill('yellow'),
        ...Array(20).fill('green'),
        ...Array(20).fill('red'),
        ...Array(10).fill('yellow-d'),
        ...Array(10).fill('green-d'),
        ...Array(10).fill('red-d'),
        ...Array(5).fill('dark'),
        ...Array(5).fill('nofill')
    ];

    const maxTiles = 130;

    function createTile() {
        let tile = document.createElement('div');
        tile.classList.add('tile');

        // 70% chance for horizontal, 30% for vertical
        const isHorizontal = Math.random() < 0.7;
        const chosenSize = isHorizontal 
            ? horizontalSizes[Math.floor(Math.random() * horizontalSizes.length)]
            : verticalSizes[Math.floor(Math.random() * verticalSizes.length)];

        tile.classList.add(chosenSize);
        tile.classList.add(colors[Math.floor(Math.random() * colors.length)]);
        return tile;
    }

    function fillGrid() {
        for (let i = 0; i < maxTiles; i++) {
            grid.appendChild(createTile());
        }
    }

    fillGrid(); // Generate initial tiles

    function updateTilesOnScroll() {
        const scrollY = window.scrollY + window.innerHeight;
        const tiles = document.querySelectorAll(".tile");

        tiles.forEach((tile) => {
            const tileTop = tile.offsetTop;
            const progress = (scrollY - tileTop) / window.innerHeight;

            if (progress > 0) {
                if (tile.dataset.fixed === "true") {
                    // Fixed tiles snap instantly
                    tile.style.transitionDelay = "0ms";
                    tile.classList.add("snapped");
                } else {
                    // Regular tiles keep the delay
                    const baseDelay = Math.min(progress * 100, 200);
                    const randomExtraDelay = Math.random() * 300;
                    tile.style.transitionDelay = `${baseDelay + randomExtraDelay}ms`;
                    tile.classList.add("snapped");
                }
            } else {
                tile.classList.remove("snapped");

                if (tile.getBoundingClientRect().top > window.innerHeight) {
                    if (tile.dataset.fixed === "true") {
                        // Hide fixed tile and respawn it
                        tile.style.opacity = "0";
                        setTimeout(() => {
                            tile.style.opacity = "1";
                        }, 500);
                    } else {
                        // Remove and regenerate non-fixed tile
                        grid.removeChild(tile);
                        grid.appendChild(createTile());
                    }
                }
            }
        });
    }

    window.addEventListener("scroll", updateTilesOnScroll);
});

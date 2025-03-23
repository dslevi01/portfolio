// 🚀 Firebase Setup
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

document.addEventListener("DOMContentLoaded", function () {
    const tripsMediaFrames = document.querySelectorAll(".trips-media-frame");

    console.log(`🔍 Found ${tripsMediaFrames.length} .trips-media-frame elements`);

    if (tripsMediaFrames.length === 0) {
        console.warn("⚠️ No .trips-media-frame elements found!");
    }

    // 🚀 Firebase Config
    const firebaseConfig = {
        apiKey: "AIzaSyAVnPMKHZk4jfBY5_BSnQKXx7WRBt5Keas",
        authDomain: "portfolio-38609.firebaseapp.com",
        databaseURL: "https://portfolio-38609-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "portfolio-38609",
        storageBucket: "portfolio-38609.firebasestorage.app",
        messagingSenderId: "897198800712",
        appId: "1:897198800712:web:5b60c794e664775f9efd7d",
        measurementId: "G-6Q5V9TXXEG"
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    
    let heartCounts = {}; // Store heart counts per image

    // 🚀 Function to handle each media frame
    function setupTripsMedia(frame, index) {
        console.log(`🛠️ Setting up frame #${index + 1}`);

        const tripsMediaContainer = frame.querySelector(".trips-media-container");
        const tripsMediaItems = Array.from(tripsMediaContainer?.querySelectorAll("img") || []);
        const tripsUpBtn = frame.querySelector(".trips-bt-up");
        const tripsDownBtn = frame.querySelector(".trips-bt-down");
        const heartButton = frame.querySelector(".heart-bt");
        const heartCounter = frame.querySelector(".heart-counter");
        const heartContainer = frame.querySelector(".heart-count-container");

        if (!tripsMediaContainer) {
            console.warn(`⚠️ No .trips-media-container found in frame #${index + 1}`);
            return;
        }

        if (tripsMediaItems.length === 0) {
            console.warn(`⚠️ No media items found in frame #${index + 1}`);
            return;
        }

        console.log(`✅ Frame #${index + 1} has ${tripsMediaItems.length} media items`);

        // Assign unique IDs and sync with Firebase
        tripsMediaItems.forEach(img => {
            let fileName = img.src.split('/').pop().split('.')[0]; // Extract file name
            img.dataset.id = fileName;

            const imageRef = ref(database, `images/${fileName}`);
            const heartRef = ref(database, `hearts/${fileName}`);

            console.log(`📂 Checking Firebase for image: ${fileName}`);

            // Store in Firebase if missing
            get(imageRef).then(snapshot => {
                if (!snapshot.exists()) {
                    console.log(`🆕 Storing image ${fileName} in Firebase`);
                    set(imageRef, { id: fileName, src: img.src });
                }
            });

            // Listen for heart count updates
            onValue(heartRef, (snapshot) => {
                heartCounts[fileName] = snapshot.exists() ? snapshot.val().hearts : 0;
                let activeItem = tripsMediaItems.find(item => item.classList.contains("active"));
                if (activeItem && activeItem.dataset.id === fileName) {
                    heartCounter.textContent = heartCounts[fileName];
                }
            });
        });

        function updateTripsView() {
            const currentItem = tripsMediaItems.find(item => item.classList.contains("active"));
            if (!currentItem) return;

            console.log(`🎯 Active item: ${currentItem.dataset.id}`);

            tripsMediaContainer.scrollTo({
                top: currentItem.offsetTop - tripsMediaContainer.offsetTop,
                behavior: "smooth"
            });

            // 🚀 Ghost state for first & last image
            const isFirst = currentItem.classList.contains("first");
            const isLast = currentItem.classList.contains("last");

            tripsUpBtn.classList.toggle("ghost", isFirst);
            tripsDownBtn.classList.toggle("ghost", isLast);

            tripsUpBtn.querySelector("img").src = isFirst ? "assets/ghost.svg" : "assets/arrow-d.svg";
            tripsDownBtn.querySelector("img").src = isLast ? "assets/ghost.svg" : "assets/arrow-d.svg";

            tripsUpBtn.style.pointerEvents = isFirst ? "none" : "auto";
            tripsDownBtn.style.pointerEvents = isLast ? "none" : "auto";

            // 💖 Update heart counter for active image
            let activeId = currentItem.dataset.id;
            heartCounter.textContent = heartCounts[activeId] || 0;
        }

        function moveToItem(newIndex) {
            tripsMediaItems.forEach(item => item.classList.remove("active"));
            tripsMediaItems[newIndex].classList.add("active");
            updateTripsView();
        }

        function syncActiveItemToScroll() {
            let closestItem = tripsMediaItems.reduce((prev, curr) => {
                return Math.abs(curr.offsetTop - tripsMediaContainer.scrollTop) < Math.abs(prev.offsetTop - tripsMediaContainer.scrollTop) ? curr : prev;
            });

            tripsMediaItems.forEach(item => item.classList.remove("active"));
            closestItem.classList.add("active");

            updateTripsView();
        }

        tripsUpBtn.addEventListener("click", () => {
            let currentIndex = tripsMediaItems.findIndex(item => item.classList.contains("active"));
            if (currentIndex > 0) moveToItem(currentIndex - 1);
        });

        tripsDownBtn.addEventListener("click", () => {
            let currentIndex = tripsMediaItems.findIndex(item => item.classList.contains("active"));
            if (currentIndex < tripsMediaItems.length - 1) moveToItem(currentIndex + 1);
        });

        tripsMediaContainer.addEventListener("scroll", () => {
            clearTimeout(tripsMediaContainer.scrollTimeout);
            tripsMediaContainer.scrollTimeout = setTimeout(syncActiveItemToScroll, 100);
        });

        // ❤️ Heart button functionality (Firebase Integration)
        heartButton.addEventListener("click", function () {
            if (heartButton.classList.contains("animating")) return;

            let currentItem = tripsMediaItems.find(item => item.classList.contains("active"));
            if (!currentItem) return;

            let activeId = currentItem.dataset.id;
            const heartRef = ref(database, `hearts/${activeId}`);

            console.log(`❤️ Liking image: ${activeId}`);

            // 🚀 Increment heart count in Firebase using update()
            get(heartRef).then((snapshot) => {
                let newCount = snapshot.exists() ? snapshot.val().hearts + 1 : 1;
                update(heartRef, { hearts: newCount });
            });
        });
    }

    // 🚀 Apply setup to all trips media frames
    tripsMediaFrames.forEach(setupTripsMedia);
});

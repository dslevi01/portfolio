// 🚀 Firebase Setup
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

import { 
    getDatabase, ref, get, set, onValue, runTransaction 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
    const tripsMediaFrames = document.querySelectorAll(".trips-media-frame");

    console.log(`🔍 Found ${tripsMediaFrames.length} .trips-media-frame elements`);

    if (tripsMediaFrames.length === 0) {
        console.warn("⚠️ No .trips-media-frame elements found!");
    }

    // 🚀 Firebase Config
    const firebaseConfig = {
        apiKey: "AIzaSyA8TuzM_qqcJg8ga6i94URyRojv8GbHVj8",
        authDomain: "portfolio-a3ea9.firebaseapp.com",
        databaseURL: "https://portfolio-a3ea9-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "portfolio-a3ea9",
        storageBucket: "portfolio-a3ea9.appspot.com", // ✅ Corrected
        messagingSenderId: "374152912195",
        appId: "1:374152912195:web:0e0e78e2f672ef8957e3f6",
        measurementId: "G-VM3TT2BXKL"
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
            let containerScrollTop = tripsMediaContainer.scrollTop;
            
            let closestItem = tripsMediaItems.reduce((prev, curr) => {
                let currDistance = Math.abs(curr.offsetTop - tripsMediaContainer.offsetTop - containerScrollTop);
                let prevDistance = Math.abs(prev.offsetTop - tripsMediaContainer.offsetTop - containerScrollTop);
                
                return currDistance < prevDistance ? curr : prev;
            });
        
            console.log(`🔄 Detected closest item: ${closestItem.dataset.id}`);
        
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
            tripsMediaContainer.scrollTimeout = setTimeout(syncActiveItemToScroll, 50);
        });

        // 🚀 Set the first item as active initially
        tripsMediaItems[0].classList.add("active");
        updateTripsView();

        // ❤️ Heart button functionality (Firebase Integration)
        heartButton.addEventListener("click", function () {
            if (heartButton.classList.contains("animating")) return;
        
            let currentItem = tripsMediaItems.find(item => item.classList.contains("active"));
            if (!currentItem) return;
        
            let activeId = currentItem.dataset.id;
            const heartRef = ref(database, `hearts/${activeId}`);
        
            heartButton.classList.add("animating");
        
            let containerRect = heartContainer.getBoundingClientRect();
            let buttonRect = heartButton.getBoundingClientRect();
            let travelDistance = buttonRect.left - containerRect.left;
            let duration = Math.max(0.3, travelDistance / 400) + "s";
        
            // 🔄 **Animate heart button movement**
            heartButton.style.transition = `transform ${duration} cubic-bezier(0.25, 1, 0.5, 1)`;
            heartButton.style.transform = `translateX(${-travelDistance}px)`;
        
            // 🔄 **Animate heart counter fade out**
            heartCounter.style.transition = `opacity ${duration} ease-in, filter ${duration} ease-in`;
            heartCounter.style.opacity = "0";
            heartCounter.style.filter = "blur(5px)";
        
            setTimeout(() => {
                // ❤️ **Update Firebase heart count AFTER animation starts**
                runTransaction(heartRef, (currentData) => {
                    if (currentData === null) {
                        return { hearts: 1 }; // Initialize if missing
                    }
                    return { hearts: currentData.hearts + 1 }; // Safe atomic increment
                }).then(({ snapshot }) => {
                    let newCount = snapshot.val().hearts;
                    
                    // 🎉 **Heart counter fade-in with updated number**
                    heartCounter.textContent = newCount;
                    heartCounter.style.transition = `opacity ${duration} ease-out, filter ${duration} ease-out`;
                    heartCounter.style.opacity = "1";
                    heartCounter.style.filter = "blur(0px)";
                }).catch((error) => {
                    console.error("🔥 Firebase heart update failed:", error);
                });

                // 🔄 **Return heart button to original position**
                heartButton.style.transition = `transform ${duration} ease-out`;
                heartButton.style.transform = "translateX(0)";
            }, parseFloat(duration) * 800);

            setTimeout(() => {
                heartButton.classList.remove("animating");
            }, parseFloat(duration) * 1000); // Reduced from 2000ms to 1000ms for a snappier feel
        });
        
    }

    // 🚀 Apply setup to all trips media frames
    tripsMediaFrames.forEach(setupTripsMedia);
});

// 🚀 Firebase Setup
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

document.addEventListener("DOMContentLoaded", function () {
    const tripsMediaContainer = document.querySelector(".trips-media-container");
    const tripsMediaItems = Array.from(tripsMediaContainer.querySelectorAll("img"));
    const tripsUpBtn = document.querySelector(".trips-bt-up");
    const tripsDownBtn = document.querySelector(".trips-bt-down");
    const heartButton = document.querySelector(".heart-bt");
    const heartCounter = document.querySelector(".heart-counter");
    const heartContainer = document.querySelector(".heart-count-container");

    let heartCounts = {}; // Object to store heart counts per image
    let scrollLock = false;

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

    // 🚀 Assign unique IDs and sync with Firebase
    tripsMediaItems.forEach(img => {
        let fileName = img.src.split('/').pop().split('.')[0]; // Extract filename
        img.dataset.id = fileName;

        const imageRef = ref(database, `images/${fileName}`);
        const heartRef = ref(database, `hearts/${fileName}`);

        // Check if the image exists in Firebase; if not, store it
        get(imageRef).then(snapshot => {
            if (!snapshot.exists()) {
                set(imageRef, { id: fileName, src: img.src });
            }
        });

        // Listen for real-time heart count updates
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
        scrollLock = true; // Lock scroll sync
        tripsMediaItems.forEach(item => item.classList.remove("active"));
        tripsMediaItems[newIndex].classList.add("active");
        updateTripsView();

        // Unlock scroll sync after scrolling finishes
        setTimeout(() => {
            scrollLock = false;
        }, 500); // Adjust timeout if needed
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
        if (scrollLock) return; // Ignore scroll events if locked

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

        // 🚀 Increment heart count in Firebase using update()
        get(heartRef).then((snapshot) => {
            let newCount = snapshot.exists() ? snapshot.val().hearts + 1 : 1;
            update(heartRef, { hearts: newCount });
        });

        let containerRect = heartContainer.getBoundingClientRect();
        let buttonRect = heartButton.getBoundingClientRect();
        let travelDistance = buttonRect.left - containerRect.left;
        let duration = Math.max(0.3, travelDistance / 400) + "s";

        heartButton.classList.add("animating");
        heartButton.style.transition = `transform ${duration} cubic-bezier(0.25, 1, 0.5, 1)`;
        heartButton.style.transform = `translateX(${-travelDistance}px)`;

        heartCounter.style.transition = `opacity ${duration} ease-in, filter ${duration} ease-in`;
        heartCounter.style.opacity = "0";
        heartCounter.style.filter = "blur(5px)";

        setTimeout(() => {
            heartCounter.style.transition = `opacity ${duration} ease-out, filter ${duration} ease-out`;
            heartCounter.style.opacity = "1";
            heartCounter.style.filter = "blur(0px)";

            heartButton.style.transition = `transform ${duration} ease-out`;
            heartButton.style.transform = "translateX(0)";
        }, parseFloat(duration) * 800);

        setTimeout(() => {
            heartButton.classList.remove("animating");
        }, parseFloat(duration) * 2000);
    });

    tripsMediaItems[0].classList.add("active");
    updateTripsView();
});

let ticking = false;

document.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            document.querySelector('.t1').style.bottom = `${4 + scrolled * -0.003}vh`;
            document.querySelector('.t2').style.bottom = `${3 + scrolled * 0.02}vh`;
            document.querySelector('.t3').style.bottom = `${5 + scrolled * -0.009}vh`;
            document.querySelector('.t4').style.bottom = `${1 + scrolled * 0.005}vh`;

            document.querySelector('.hero-items-container').style.transform = `translateY(${scrolled * -0.2}px)`;

            ticking = false; // Allow next frame update
        });

        ticking = true; // Prevent multiple updates per frame
    }
});
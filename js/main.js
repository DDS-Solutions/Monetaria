document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initSpotlight();
    initScrollReveal();
});

/**
 * Hero Parallax Effect
 * Moves the hero background slightly opposite to mouse movement
 * to create a depth feel for the "Cabinet".
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (!hero || !heroContent) return;

    hero.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        heroContent.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translateX(0) translateY(0)';
    });
}

/**
 * Spotlight Effect for Cards
 * Adds a radial gradient that follows the mouse cursor over cards,
 * simulating a flashlight or museum track light.
 */
function initSpotlight() {
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * Scroll Reveal
 * "Opens the drawers" as the user scrolls down.
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-drawer, .feature-card').forEach(el => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
}

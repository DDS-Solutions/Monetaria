import VisionEngine from './vision_engine.js';

document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initSpotlight();
    initScrollReveal();
    initVision();
});

/**
 * AI Vision Implementation
 * Handles specimen upload, scanning animation, and result display.
 */
function initVision() {
    const uploadInput = document.getElementById('shell-upload');
    const scanContainer = document.getElementById('scan-container');
    const previewContainer = document.getElementById('preview-container');
    const statusText = document.getElementById('vision-status');

    // Result Panels
    const staticPanel = document.getElementById('taxonomy-static');
    const resultPanel = document.getElementById('taxonomy-results');

    if (!uploadInput) return;

    uploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Reset UI & Show Preview
        staticPanel.style.display = 'block';
        resultPanel.style.display = 'none';
        previewContainer.innerHTML = '';
        statusText.innerText = `TARGET: ${file.name.toUpperCase()} // STATUS: SCAN_INIT`;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);

        // 2. Start Scanning Animation
        scanContainer.classList.add('scan-active');

        // 3. Trigger Engine
        const result = await VisionEngine.gradeShell(file);

        // 4. Handle Result
        scanContainer.classList.remove('scan-active');

        if (result.status === 'CONSERVATION_ALERT') {
            statusText.innerHTML = `<span style="color: var(--color-alert-red)">ALERT: ${result.reason}</span>`;
            return;
        }

        if (result.status === 'SUCCESS') {
            displayResults(result.data);
        }
    });

    function displayResults(data) {
        statusText.innerText = `TARGET: ${data.species_prediction.scientific_name.toUpperCase()} // GRADE: ${data.condition_report.grade.toUpperCase()}`;

        // Transition Panels
        staticPanel.style.display = 'none';
        resultPanel.style.display = 'block';

        // Update Metrics
        animateBar('bar-gloss', 'val-gloss', data.condition_report.gloss_score);
        animateBar('bar-lip', 'val-lip', data.condition_report.gloss_score - 5); // Simulated variation
        animateBar('bar-pattern', 'val-pattern', (data.species_prediction.confidence * 100).toFixed(0));

        // Update Taxonomy
        document.getElementById('result-family').innerText = data.species_prediction.family;
        document.getElementById('result-genus').innerText = data.species_prediction.scientific_name.split(' ')[0];
        document.getElementById('result-species').innerText = data.species_prediction.scientific_name;
        document.getElementById('result-synonyms').innerText = data.species_prediction.synonyms.join(', ');

        // Update Valuation
        document.getElementById('result-price').innerText = `$${data.estimated_value}`;
        const recordsElement = document.getElementById('result-records');
        if (recordsElement) recordsElement.innerText = data.species_prediction.records.toLocaleString();
    }

    function animateBar(id, valId, target) {
        const bar = document.getElementById(id);
        const text = document.getElementById(valId);
        let current = 0;

        const interval = setInterval(() => {
            if (current >= target) {
                clearInterval(interval);
            } else {
                current++;
                bar.style.width = `${current}%`;
                text.innerText = `${current}%`;
            }
        }, 20);
    }
}

/**
 * Hero Parallax Effect
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

    hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translateX(0) translateY(0)';
    });
}

/**
 * Spotlight Effect for Cards
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
 */
function initScrollReveal() {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
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

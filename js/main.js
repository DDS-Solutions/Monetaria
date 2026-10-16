import VisionEngine from './vision_engine.js';

document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initSpotlight();
    initScrollReveal();
    initVision();
    initWaitlistModal();
});

/**
 * AI Vision Implementation
 * Handles specimen upload, sample presets, scanning animation, defect markers, and result display.
 */
function initVision() {
    const uploadInput = document.getElementById('shell-upload');
    const uploadTrigger = document.getElementById('btn-upload-trigger');
    const scanContainer = document.getElementById('scan-container');
    const previewContainer = document.getElementById('preview-container');
    const defectContainer = document.getElementById('defect-markers');
    const statusText = document.getElementById('vision-status');

    // Result Panels
    const staticPanel = document.getElementById('taxonomy-static');
    const resultPanel = document.getElementById('taxonomy-results');

    // Active animation interval references
    const activeIntervals = {};

    if (uploadTrigger && uploadInput) {
        uploadTrigger.addEventListener('click', () => uploadInput.click());
    }

    // 1-Click Interactive Sample Specimen Buttons
    const sampleButtons = document.querySelectorAll('.btn-sample');
    sampleButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const sampleKey = btn.getAttribute('data-sample');
            if (!sampleKey) return;

            // Visual sample setup
            staticPanel.style.display = 'block';
            resultPanel.style.display = 'none';
            previewContainer.innerHTML = '';
            if (defectContainer) defectContainer.innerHTML = '';

            const sample = VisionEngine.getSample(sampleKey);
            const targetName = sample ? sample.fileName : sampleKey.toUpperCase();
            statusText.innerText = `TARGET: ${targetName} // STATUS: SCAN_INIT`;

            if (sample && sample.data && sample.data.svgArtwork) {
                previewContainer.innerHTML = sample.data.svgArtwork;
            } else {
                previewContainer.innerHTML = `<div style="font-family: var(--font-tech); color: var(--color-cyan-neon); font-size: 0.9rem; text-align: center; padding: 2rem;">[SPECIMEN_FEED: ${sampleKey.toUpperCase()}]</div>`;
            }

            scanContainer.classList.add('scan-active');

            const result = await VisionEngine.gradeShell(sampleKey);
            scanContainer.classList.remove('scan-active');

            handleScanResult(result);
        });
    });

    if (uploadInput) {
        uploadInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // 1. Reset UI & Show Preview
            staticPanel.style.display = 'block';
            resultPanel.style.display = 'none';
            previewContainer.innerHTML = '';
            if (defectContainer) defectContainer.innerHTML = '';
            statusText.innerText = `TARGET: ${file.name.toUpperCase()} // STATUS: SCAN_INIT`;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.alt = `Uploaded specimen ${file.name}`;
                previewContainer.appendChild(img);
            };
            reader.onerror = () => {
                statusText.innerHTML = `<span style="color: var(--color-alert-red)">ERROR: UNABLE_TO_READ_SPECIMEN_FILE</span>`;
            };
            reader.readAsDataURL(file);

            // 2. Start Scanning Animation
            scanContainer.classList.add('scan-active');

            // 3. Trigger Engine
            const result = await VisionEngine.gradeShell(file);

            // 4. Reset input value so re-selecting same file triggers change event
            uploadInput.value = '';

            // 5. Handle Result
            scanContainer.classList.remove('scan-active');
            handleScanResult(result);
        });
    }

    function handleScanResult(result) {
        if (!result) return;

        if (result.status === 'BUSY') {
            statusText.innerHTML = `<span style="color: var(--color-gold)">NOTICE: ${result.reason}</span>`;
            return;
        }

        if (result.status === 'CONSERVATION_ALERT') {
            statusText.innerHTML = `<span style="color: var(--color-alert-red)">⚠️ CONSERVATION ALERT: ${result.reason}</span>`;
            if (defectContainer) {
                defectContainer.innerHTML = `
                    <div class="defect-marker" style="left: 50%; top: 45%;">
                        <span>ETHICAL VIOLATION: LIVING ANIMAL</span>
                    </div>`;
            }
            return;
        }

        if (result.status === 'SUCCESS' && result.data) {
            displayResults(result.data);
        }
    }

    function displayResults(data) {
        statusText.innerText = `TARGET: ${data.species_prediction.scientific_name.toUpperCase()} // GRADE: ${data.condition_report.grade.toUpperCase()}`;

        // Transition Panels
        staticPanel.style.display = 'none';
        resultPanel.style.display = 'block';

        // Render Defect Markers on Specimen Preview
        if (defectContainer) {
            defectContainer.innerHTML = '';
            const defects = data.condition_report.defects_detected || [];
            defects.forEach(defect => {
                const marker = document.createElement('div');
                marker.className = 'defect-marker';
                marker.style.left = `${defect.x || 50}%`;
                marker.style.top = `${defect.y || 50}%`;
                marker.innerHTML = `<span>${defect.name}</span>`;
                defectContainer.appendChild(marker);
            });
        }

        // Update Metrics with Safe Animation
        const gloss = Math.min(100, Math.max(0, parseInt(data.condition_report.gloss_score, 10) || 85));
        const lip = Math.min(100, Math.max(0, gloss - 6));
        const pattern = Math.min(100, Math.max(0, Math.round((data.species_prediction.confidence || 0.95) * 100)));

        animateBar('bar-gloss', 'val-gloss', 'prog-gloss', gloss);
        animateBar('bar-lip', 'val-lip', 'prog-lip', lip);
        animateBar('bar-pattern', 'val-pattern', 'prog-pattern', pattern);

        // Update Specimen Diagnostic Pill Badges
        const commonElem = document.getElementById('result-common');
        if (commonElem) commonElem.innerText = data.species_prediction.common_name || '--';

        const sizeElem = document.getElementById('result-size');
        if (sizeElem) sizeElem.innerText = `${data.size_mm || '--'} mm`;

        const surfaceElem = document.getElementById('result-surface');
        if (surfaceElem) surfaceElem.innerText = data.condition_report.surface_integrity || '--';

        const diagElem = document.getElementById('result-diagnostic');
        if (diagElem) diagElem.innerText = data.species_prediction.key_diagnostic_feature || '--';

        // Update Taxonomy Tree
        const genus = data.species_prediction.scientific_name.split(' ')[0] || '--';
        document.getElementById('result-family').innerText = data.species_prediction.family || '--';
        document.getElementById('result-genus').innerText = genus;
        document.getElementById('result-species').innerText = data.species_prediction.scientific_name || '--';

        const synElem = document.getElementById('result-synonyms');
        if (synElem) {
            synElem.innerText = (data.species_prediction.synonyms && data.species_prediction.synonyms.length > 0)
                ? data.species_prediction.synonyms.join(', ')
                : 'None recorded';
        }

        // Update Valuation
        const priceElem = document.getElementById('result-price');
        if (priceElem) priceElem.innerText = `$${data.estimated_value || '0.00'}`;

        const recordsElem = document.getElementById('result-records');
        if (recordsElem) recordsElem.innerText = (data.species_prediction.records || 0).toLocaleString();
    }

    function animateBar(barId, valId, progId, targetValue) {
        const bar = document.getElementById(barId);
        const text = document.getElementById(valId);
        const prog = document.getElementById(progId);
        if (!bar || !text) return;

        // Clear existing interval on this element
        if (activeIntervals[barId]) {
            clearInterval(activeIntervals[barId]);
        }

        const target = Math.min(100, Math.max(0, Math.round(targetValue)));
        let current = 0;
        bar.style.width = '0%';
        text.innerText = '0%';
        if (prog) prog.setAttribute('aria-valuenow', '0');

        activeIntervals[barId] = setInterval(() => {
            if (current >= target) {
                clearInterval(activeIntervals[barId]);
                delete activeIntervals[barId];
                bar.style.width = `${target}%`;
                text.innerText = `${target}%`;
                if (prog) prog.setAttribute('aria-valuenow', String(target));
            } else {
                current += 2;
                if (current > target) current = target;
                bar.style.width = `${current}%`;
                text.innerText = `${current}%`;
                if (prog) prog.setAttribute('aria-valuenow', String(current));
            }
        }, 18);
    }
}

/**
 * Interactive Waitlist Modal
 */
function initWaitlistModal() {
    const modal = document.getElementById('waitlist-modal');
    const openBtn = document.getElementById('btn-open-waitlist');
    const closeBtn = document.getElementById('btn-close-waitlist');
    const successCloseBtn = document.getElementById('btn-success-close');
    const form = document.getElementById('waitlist-form');
    const formContainer = document.getElementById('waitlist-form-container');
    const successContainer = document.getElementById('waitlist-success');

    if (!modal) return;

    function openModal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        const emailInput = document.getElementById('collector-email');
        if (emailInput) setTimeout(() => emailInput.focus(), 100);
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('collector-email').value;
            const focus = document.getElementById('collector-focus').value;

            // Persist to localStorage
            try {
                const waitlistEntries = JSON.parse(localStorage.getItem('monetaria_waitlist') || '[]');
                waitlistEntries.push({ email, focus, timestamp: new Date().toISOString() });
                localStorage.setItem('monetaria_waitlist', JSON.stringify(waitlistEntries));
            } catch {
                // Ignore storage quotas / blocked storage
            }

            formContainer.style.display = 'none';
            successContainer.style.display = 'block';
        });
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

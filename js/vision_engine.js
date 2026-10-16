/**
 * Monetaria Vision Engine (Simulation Mode)
 * 
 * This module mirrors the app's `VisionService.dart` logic.
 * It handles the "Safety Gate" (Liveness Check) and "Malacologist" grading logic.
 */

const SAMPLE_SPECIMENS = {
    tiger_cowrie: {
        fileName: 'SPECIMEN_CYPRAEA_TIGRIS.RAW',
        isLive: false,
        data: {
            species_prediction: {
                scientific_name: 'Cypraea tigris',
                common_name: 'Tiger Cowrie',
                confidence: 0.984,
                family: 'Cypraeidae',
                synonyms: ['Lyncina tigris', 'Cypraea lynx (historical mis-id)'],
                records: 8420,
                key_diagnostic_feature: 'Dense dark circular dorsal maculations on ivory ground'
            },
            condition_report: {
                grade: 'Fine',
                gloss_score: 86,
                surface_integrity: 'Good (Minor wear)',
                defects_detected: [
                    { name: 'Growth line', x: 48, y: 35 },
                    { name: 'Aperture wear', x: 62, y: 70 }
                ]
            },
            size_mm: '84.2',
            estimated_value: '45.00',
            svgArtwork: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="cowrieGrad" cx="45%" cy="40%" r="60%">
                        <stop offset="0%" stop-color="#FFF8E7"/>
                        <stop offset="40%" stop-color="#EED9B3"/>
                        <stop offset="85%" stop-color="#C29A64"/>
                        <stop offset="100%" stop-color="#5C3818"/>
                    </radialGradient>
                    <radialGradient id="spotGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#2B1408"/>
                        <stop offset="70%" stop-color="#4E2713"/>
                        <stop offset="100%" stop-color="#7B4926" stop-opacity="0.8"/>
                    </radialGradient>
                </defs>
                <ellipse cx="100" cy="100" rx="65" ry="85" fill="url(#cowrieGrad)" stroke="#00E5FF" stroke-width="1.5" stroke-opacity="0.4" filter="drop-shadow(0 0 15px rgba(0,229,255,0.2))"/>
                <ellipse cx="95" cy="70" rx="12" ry="9" fill="url(#spotGrad)"/>
                <ellipse cx="120" cy="85" rx="10" ry="14" fill="url(#spotGrad)"/>
                <ellipse cx="78" cy="110" rx="14" ry="11" fill="url(#spotGrad)"/>
                <ellipse cx="115" cy="125" rx="15" ry="12" fill="url(#spotGrad)"/>
                <ellipse cx="85" cy="145" rx="10" ry="8" fill="url(#spotGrad)"/>
                <path d="M 98 25 Q 104 100 98 175" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.6" fill="none"/>
            </svg>`
        }
    },
    glory_of_the_seas: {
        fileName: 'SPECIMEN_CONUS_GLORIAMARIS.RAW',
        isLive: false,
        data: {
            species_prediction: {
                scientific_name: 'Conus gloriamaris',
                common_name: 'Glory of the Seas',
                confidence: 0.995,
                family: 'Conidae',
                synonyms: ['Cylinder gloriamaris'],
                records: 1240,
                key_diagnostic_feature: 'Micro-reticulate triangle netting with three golden-brown color bands'
            },
            condition_report: {
                grade: 'Gem',
                gloss_score: 98,
                surface_integrity: 'Pristine (Museum Quality)',
                defects_detected: [] // Flawless Gem grade
            },
            size_mm: '118.6',
            estimated_value: '500.00',
            svgArtwork: `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFFDF7"/>
                        <stop offset="30%" stop-color="#EED5A5"/>
                        <stop offset="60%" stop-color="#C59B58"/>
                        <stop offset="100%" stop-color="#7C4F1A"/>
                    </linearGradient>
                </defs>
                <polygon points="100,20 145,70 120,185 80,185 55,70" fill="url(#coneGrad)" stroke="#FFD54F" stroke-width="1.5" stroke-opacity="0.6" filter="drop-shadow(0 0 20px rgba(255,213,79,0.3))"/>
                <polygon points="100,10 130,35 70,35" fill="#FFE8B5" stroke="#FFD54F" stroke-width="1"/>
                <path d="M 65 75 Q 100 80 135 75 M 68 115 Q 100 120 132 115 M 72 150 Q 100 155 128 150" stroke="#FFD54F" stroke-width="2" stroke-opacity="0.5" fill="none"/>
                <circle cx="100" cy="100" r="3" fill="#00E5FF"/>
            </svg>`
        }
    },
    live_mollusk: {
        fileName: 'LIVE_ANIMAL_OBSERVATION.RAW',
        isLive: true,
        reason: 'Specimen displays active foot mantle and siphon extension. Monetaria adheres strictly to ethical conchological standards and does not grade or appraise living animals.'
    }
};

const VisionEngine = {
    isProcessing: false,

    /**
     * Grades a shell specimen from a user-uploaded File or a preset specimen ID.
     */
    async gradeShell(input) {
        if (this.isProcessing) {
            return {
                status: 'BUSY',
                reason: 'A specimen analysis is currently active. Please wait.'
            };
        }

        this.isProcessing = true;

        try {
            // Check if input is a sample key
            if (typeof input === 'string' && SAMPLE_SPECIMENS[input]) {
                const sample = SAMPLE_SPECIMENS[input];
                await new Promise(resolve => setTimeout(resolve, 1400));

                if (sample.isLive) {
                    return {
                        status: 'CONSERVATION_ALERT',
                        reason: sample.reason,
                        isSample: true
                    };
                }

                return {
                    status: 'SUCCESS',
                    data: sample.data,
                    isSample: true
                };
            }

            // Real uploaded File object
            const file = input;
            const isLive = await this._simulateLivenessCheck(file);

            if (isLive) {
                return {
                    status: 'CONSERVATION_ALERT',
                    reason: 'Specimen appears to be a LIVE ANIMAL. Monetaria does not grade living mollusks to prevent unethical collecting.'
                };
            }

            const result = await this._simulateGrading(file);
            return {
                status: 'SUCCESS',
                data: result
            };
        } finally {
            this.isProcessing = false;
        }
    },

    async _simulateLivenessCheck(file) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return file.name.toLowerCase().includes('live');
    },

    async _simulateGrading(file) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const grades = ['Gem', 'Excellent', 'Fine', 'Commercial'];
        const speciesList = [
            {
                sci: 'Cypraea tigris',
                common: 'Tiger Cowrie',
                val: 45.00,
                family: 'Cypraeidae',
                synonyms: ['Lyncina tigris', 'Cypraea lynx (mis-id)'],
                records: 8420,
                diagnostic: 'Broad rounded dorsum with dense dark blotches and clear lateral margin spots'
            },
            {
                sci: 'Conus gloriamaris',
                common: 'Glory of the Seas',
                val: 250.00,
                family: 'Conidae',
                synonyms: ['Cylinder gloriamaris'],
                records: 1240,
                diagnostic: 'Slender cylindrical spire with fine interlocking amber micro-triangles'
            },
            {
                sci: 'Monetaria moneta',
                common: 'Money Cowrie',
                val: 8.50,
                family: 'Cypraeidae',
                synonyms: ['Cypraea moneta'],
                records: 12450,
                diagnostic: 'Marginal tuberculate callosities with distinctive pale yellow-gold ring'
            }
        ];

        const selectedSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
        const selectedGrade = grades[Math.floor(Math.random() * grades.length)];
        const glossScore = Math.floor(82 + Math.random() * 17);

        const defects = [];
        if (selectedGrade !== 'Gem') {
            defects.push({ name: 'Growth line', x: Math.floor(35 + Math.random() * 30), y: Math.floor(30 + Math.random() * 30) });
            if (selectedGrade === 'Commercial' || selectedGrade === 'Fine') {
                defects.push({ name: 'Lip abrasion', x: Math.floor(55 + Math.random() * 25), y: Math.floor(65 + Math.random() * 20) });
            }
        }

        return {
            species_prediction: {
                scientific_name: selectedSpecies.sci,
                common_name: selectedSpecies.common,
                confidence: 0.96 + (Math.random() * 0.035),
                family: selectedSpecies.family,
                synonyms: selectedSpecies.synonyms,
                records: selectedSpecies.records,
                key_diagnostic_feature: selectedSpecies.diagnostic
            },
            condition_report: {
                grade: selectedGrade,
                gloss_score: glossScore,
                surface_integrity: selectedGrade === 'Gem' ? 'Pristine (No defects)' : (selectedGrade === 'Excellent' ? 'Near-Mint' : 'Collector Grade'),
                defects_detected: defects
            },
            size_mm: (38 + Math.random() * 52).toFixed(1),
            estimated_value: (selectedSpecies.val * (selectedGrade === 'Gem' ? 2 : (selectedGrade === 'Excellent' ? 1.4 : 1))).toFixed(2)
        };
    },

    getSample(key) {
        return SAMPLE_SPECIMENS[key] || null;
    }
};

export default VisionEngine;

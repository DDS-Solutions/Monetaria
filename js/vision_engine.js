/**
 * Monetaria Vision Engine (Simulation Mode)
 * 
 * This module mirrors the app's `VisionService.dart` logic.
 * It handles the "Safety Gate" (Liveness) and "Malacologist" grading logic.
 */

const VisionEngine = {
    isProcessing: false,

    /**
     * Simulates the grading process.
     * Logic flow matches VisionService.gradeShell()
     */
    async gradeShell(imageFile) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // 1. Simulate "Safety Gate" (Liveness Check)
        const isLive = await this._simulateLivenessCheck(imageFile);

        if (isLive) {
            this.isProcessing = false;
            return {
                status: 'CONSERVATION_ALERT',
                reason: 'Specimen appears to be a LIVE ANIMAL. Monetaria does not grade living mollusks to prevent unethical collecting.'
            };
        }

        // 2. Simulate "Malacologist" Grading
        const result = await this._simulateGrading(imageFile);

        this.isProcessing = false;
        return {
            status: 'SUCCESS',
            data: result
        };
    },

    async _simulateLivenessCheck(file) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return file.name.toLowerCase().includes('live');
    },

    async _simulateGrading(file) {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const grades = ['Gem', 'Excellent', 'Fine', 'Commercial'];
        const species = [
            {
                sci: 'Cypraea tigris',
                common: 'Tiger Cowrie',
                val: 45.00,
                family: 'Cypraeidae',
                synonyms: ['Lyncina tigris', 'Cypraea lynx (mis-id)'],
                records: 8420
            },
            {
                sci: 'Conus gloriamaris',
                common: 'Glory of the Seas',
                val: 250.00,
                family: 'Conidae',
                synonyms: ['Cylinder gloriamaris'],
                records: 1240
            },
            {
                sci: 'Monetaria moneta',
                common: 'Money Cowrie',
                val: 5.00,
                family: 'Cypraeidae',
                synonyms: ['Cypraea moneta'],
                records: 12450
            }
        ];

        const selectedSpecies = species[Math.floor(Math.random() * species.length)];
        const selectedGrade = grades[Math.floor(Math.random() * grades.length)];

        return {
            species_prediction: {
                scientific_name: selectedSpecies.sci,
                common_name: selectedSpecies.common,
                confidence: 0.96 + (Math.random() * 0.03),
                family: selectedSpecies.family,
                synonyms: selectedSpecies.synonyms,
                records: selectedSpecies.records,
                key_diagnostic_feature: 'Distinct dorsal banding'
            },
            condition_report: {
                grade: selectedGrade,
                gloss_score: Math.floor(80 + Math.random() * 20),
                defects_detected: selectedGrade === 'Gem' ? [] : ['Minor growth line', 'Rough lip'],
                surface_integrity: selectedGrade === 'Gem' ? 'Pristine' : 'High'
            },
            size_mm: (40 + Math.random() * 50).toFixed(1),
            estimated_value: (selectedSpecies.val * (selectedGrade === 'Gem' ? 2 : 1)).toFixed(2)
        };
    }
};

export default VisionEngine;

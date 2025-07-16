/**
 * Microtuna - Arpeggiator and Musical Sequences
 * Musical sequences for different tuning systems representing quintessential examples 
 * of each tuning system's character with authentic cultural musical traditions.
 * 
 * Copyright (c) 2025 Peter Thomas
 * Licensed under the MIT License - see LICENSE file for details
 */

class ArpSequencer {
    constructor() {
        this.sequences = this.initializeSequences();
        this.currentSequence = null;
        this.currentTuningSystem = null;
        this.isPlaying = false;
        this.currentStep = 0;
        this.playbackInterval = null;
        this.noteScheduleId = null;
    }

    initializeSequences() {
        return {
            '12-tet': {
                name: '12-TET (Equal)',
                sequences: [
                    {
                        name: 'C Major Scale',
                        description: 'Classic diatonic scale showing equal temperament',
                        tempo: 120,
                        timeSignature: [4, 4],
                        notes: [
                            { note: 'C4', duration: 0.5, velocity: 0.8 },
                            { note: 'D4', duration: 0.5, velocity: 0.8 },
                            { note: 'E4', duration: 0.5, velocity: 0.8 },
                            { note: 'F4', duration: 0.5, velocity: 0.8 },
                            { note: 'G4', duration: 0.5, velocity: 0.8 },
                            { note: 'A4', duration: 0.5, velocity: 0.8 },
                            { note: 'B4', duration: 0.5, velocity: 0.8 },
                            { note: 'C5', duration: 1.0, velocity: 0.9 }
                        ]
                    },
                    {
                        name: 'Bach-style Progression',
                        description: 'Demonstrates 12-TET chord progressions',
                        tempo: 100,
                        timeSignature: [4, 4],
                        notes: [
                            { note: 'C4', duration: 1.0, velocity: 0.8 },
                            { note: 'F4', duration: 1.0, velocity: 0.8 },
                            { note: 'G4', duration: 1.0, velocity: 0.8 },
                            { note: 'C4', duration: 1.0, velocity: 0.8 },
                            { note: 'Am', duration: 1.0, velocity: 0.7 }, // A minor chord
                            { note: 'Dm', duration: 1.0, velocity: 0.7 }, // D minor chord
                            { note: 'G4', duration: 1.0, velocity: 0.8 },
                            { note: 'C4', duration: 2.0, velocity: 0.9 }
                        ]
                    },
                    {
                        name: 'Chromatic Run',
                        description: 'All 12 semitones in equal temperament',
                        tempo: 140,
                        timeSignature: [4, 4],
                        notes: [
                            { note: 'C4', duration: 0.25, velocity: 0.7 },
                            { note: 'C#4', duration: 0.25, velocity: 0.7 },
                            { note: 'D4', duration: 0.25, velocity: 0.7 },
                            { note: 'D#4', duration: 0.25, velocity: 0.7 },
                            { note: 'E4', duration: 0.25, velocity: 0.7 },
                            { note: 'F4', duration: 0.25, velocity: 0.7 },
                            { note: 'F#4', duration: 0.25, velocity: 0.7 },
                            { note: 'G4', duration: 0.25, velocity: 0.7 },
                            { note: 'G#4', duration: 0.25, velocity: 0.7 },
                            { note: 'A4', duration: 0.25, velocity: 0.7 },
                            { note: 'A#4', duration: 0.25, velocity: 0.7 },
                            { note: 'B4', duration: 0.25, velocity: 0.7 },
                            { note: 'C5', duration: 1.0, velocity: 0.9 }
                        ]
                    },
                    {
                        name: 'Jazz ii-V-I',
                        description: 'Classic jazz progression in 12-TET',
                        tempo: 120,
                        timeSignature: [4, 4],
                        notes: [
                            { note: 'D4', duration: 0.5, velocity: 0.8 },
                            { note: 'F4', duration: 0.5, velocity: 0.8 },
                            { note: 'A4', duration: 0.5, velocity: 0.8 },
                            { note: 'C5', duration: 0.5, velocity: 0.8 },
                            { note: 'G4', duration: 0.5, velocity: 0.8 },
                            { note: 'B4', duration: 0.5, velocity: 0.8 },
                            { note: 'D5', duration: 0.5, velocity: 0.8 },
                            { note: 'F5', duration: 0.5, velocity: 0.8 },
                            { note: 'C4', duration: 2.0, velocity: 0.9 }
                        ]
                    }
                ]
            },

            'just': {
                name: 'Just Intonation',
                sequences: [
                    {
                        name: 'Pure Major Triad',
                        description: 'Perfect 4:5:6 ratios in just intonation',
                        tempo: 80,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 2.0, velocity: 0.8 },     // 1/1 - Root
                            { ratio: 1.25, duration: 2.0, velocity: 0.8 },    // 5/4 - Major third
                            { ratio: 1.5, duration: 2.0, velocity: 0.8 },     // 3/2 - Perfect fifth
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 }      // 2/1 - Octave
                        ]
                    },
                    {
                        name: 'Ptolemy Sequence',
                        description: 'Ancient Greek just intonation scale',
                        tempo: 100,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 0.5, velocity: 0.8 },     // 1/1
                            { ratio: 1.125, duration: 0.5, velocity: 0.8 },   // 9/8
                            { ratio: 1.25, duration: 0.5, velocity: 0.8 },    // 5/4
                            { ratio: 1.333, duration: 0.5, velocity: 0.8 },   // 4/3
                            { ratio: 1.5, duration: 0.5, velocity: 0.8 },     // 3/2
                            { ratio: 1.667, duration: 0.5, velocity: 0.8 },   // 5/3
                            { ratio: 1.875, duration: 0.5, velocity: 0.8 },   // 15/8
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 }      // 2/1
                        ]
                    },
                    {
                        name: 'Harmonic Series Fragment',
                        description: 'Natural harmonics 8-16',
                        tempo: 90,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.0, velocity: 0.9 },     // 8/8
                            { ratio: 1.125, duration: 0.5, velocity: 0.8 },   // 9/8
                            { ratio: 1.25, duration: 0.5, velocity: 0.8 },    // 10/8
                            { ratio: 1.375, duration: 0.5, velocity: 0.8 },   // 11/8
                            { ratio: 1.5, duration: 0.5, velocity: 0.8 },     // 12/8
                            { ratio: 1.625, duration: 0.5, velocity: 0.8 },   // 13/8
                            { ratio: 1.75, duration: 0.5, velocity: 0.8 },    // 14/8
                            { ratio: 1.875, duration: 0.5, velocity: 0.8 },   // 15/8
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 }      // 16/8
                        ]
                    },
                    {
                        name: 'Barbershop Chord',
                        description: 'Classic barbershop harmony ratios',
                        tempo: 60,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 4.0, velocity: 0.8 },     // Root
                            { ratio: 1.25, duration: 4.0, velocity: 0.8 },    // Major third
                            { ratio: 1.5, duration: 4.0, velocity: 0.8 },     // Perfect fifth
                            { ratio: 1.778, duration: 4.0, velocity: 0.8 }    // Minor seventh (16/9)
                        ]
                    }
                ]
            },

            'pythagorean': {
                name: 'Pythagorean',
                sequences: [
                    {
                        name: 'Pythagorean Scale',
                        description: 'Pure 3:2 perfect fifths',
                        tempo: 110,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 0.5, velocity: 0.8 },     // 1/1
                            { ratio: 1.125, duration: 0.5, velocity: 0.8 },   // 9/8
                            { ratio: 1.266, duration: 0.5, velocity: 0.8 },   // 81/64
                            { ratio: 1.333, duration: 0.5, velocity: 0.8 },   // 4/3
                            { ratio: 1.5, duration: 0.5, velocity: 0.8 },     // 3/2
                            { ratio: 1.688, duration: 0.5, velocity: 0.8 },   // 27/16
                            { ratio: 1.898, duration: 0.5, velocity: 0.8 },   // 243/128
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 }      // 2/1
                        ]
                    },
                    {
                        name: 'Circle of Fifths',
                        description: 'Demonstrating Pythagorean comma',
                        tempo: 120,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 0.5, velocity: 0.8 },     // C
                            { ratio: 1.5, duration: 0.5, velocity: 0.8 },     // G
                            { ratio: 1.125, duration: 0.5, velocity: 0.8 },   // D (down octave)
                            { ratio: 1.688, duration: 0.5, velocity: 0.8 },   // A
                            { ratio: 1.266, duration: 0.5, velocity: 0.8 },   // E (down octave)
                            { ratio: 1.898, duration: 0.5, velocity: 0.8 },   // B
                            { ratio: 1.424, duration: 0.5, velocity: 0.8 },   // F# (down octave)
                            { ratio: 1.0, duration: 1.0, velocity: 0.9 }      // Return to C
                        ]
                    },
                    {
                        name: 'Medieval Organum',
                        description: 'Ancient parallel harmony',
                        tempo: 80,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 2.0, velocity: 0.8 },
                            { ratio: 1.333, duration: 2.0, velocity: 0.8 },   // Perfect fourth
                            { ratio: 1.5, duration: 2.0, velocity: 0.8 },     // Perfect fifth
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 }      // Octave
                        ]
                    },
                    {
                        name: 'Pythagorean Ditone',
                        description: 'Sharp major third (81/64)',
                        tempo: 100,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.0, velocity: 0.8 },
                            { ratio: 1.266, duration: 1.0, velocity: 0.8 },   // 81/64 - Pythagorean major third
                            { ratio: 1.5, duration: 1.0, velocity: 0.8 },
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 }
                        ]
                    }
                ]
            },

            'arabic-24': {
                name: 'Arabic 24-Quarter',
                sequences: [
                    {
                        name: 'Maqam Bayati',
                        description: 'Classic Arabic maqam with quarter-tones',
                        tempo: 90,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 0.5, velocity: 0.8 },     // D
                            { ratio: 1.067, duration: 0.5, velocity: 0.8 },   // E♭- (quarter flat)
                            { ratio: 1.185, duration: 0.5, velocity: 0.8 },   // F
                            { ratio: 1.333, duration: 0.5, velocity: 0.8 },   // G
                            { ratio: 1.5, duration: 0.5, velocity: 0.8 },     // A
                            { ratio: 1.600, duration: 0.5, velocity: 0.8 },   // B♭- (quarter flat)
                            { ratio: 1.778, duration: 0.5, velocity: 0.8 },   // C
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 }      // D octave
                        ]
                    },
                    {
                        name: 'Maqam Hijaz',
                        description: 'Distinctive hijaz tetrachord',
                        tempo: 100,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 0.75, velocity: 0.8 },    // D
                            { ratio: 1.067, duration: 0.25, velocity: 0.7 },  // E♭-
                            { ratio: 1.26, duration: 0.75, velocity: 0.8 },   // F#
                            { ratio: 1.333, duration: 0.25, velocity: 0.7 },  // G
                            { ratio: 1.5, duration: 1.0, velocity: 0.9 },     // A
                            { ratio: 1.333, duration: 0.5, velocity: 0.7 },   // G
                            { ratio: 1.26, duration: 0.5, velocity: 0.7 },    // F#
                            { ratio: 1.0, duration: 1.0, velocity: 0.9 }      // D
                        ]
                    },
                    {
                        name: 'Samazen Rhythm',
                        description: 'Rhythmic pattern with microtones',
                        tempo: 120,
                        timeSignature: [8, 8],
                        notes: [
                            { ratio: 1.0, duration: 0.5, velocity: 0.9 },
                            { ratio: 1.067, duration: 0.25, velocity: 0.6 },
                            { ratio: 1.185, duration: 0.25, velocity: 0.8 },
                            { ratio: 1.0, duration: 0.5, velocity: 0.7 },
                            { ratio: 1.333, duration: 0.5, velocity: 0.8 },
                            { ratio: 1.5, duration: 0.5, velocity: 0.9 },
                            { ratio: 1.600, duration: 0.25, velocity: 0.6 },
                            { ratio: 1.5, duration: 0.25, velocity: 0.7 }
                        ]
                    },
                    {
                        name: 'Taqsim Exploration',
                        description: 'Free-form Arabic improvisation style',
                        tempo: 70,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.5, duration: 1.5, velocity: 0.8 },     // Start on dominant
                            { ratio: 1.600, duration: 0.5, velocity: 0.6 },
                            { ratio: 1.778, duration: 1.0, velocity: 0.7 },
                            { ratio: 2.0, duration: 0.5, velocity: 0.8 },
                            { ratio: 1.778, duration: 0.5, velocity: 0.6 },
                            { ratio: 1.5, duration: 1.0, velocity: 0.7 },
                            { ratio: 1.333, duration: 0.5, velocity: 0.6 },
                            { ratio: 1.0, duration: 1.5, velocity: 0.9 }
                        ]
                    }
                ]
            },

            '19-tet': {
                name: '19-TET',
                sequences: [
                    {
                        name: '19-TET Chromatic',
                        description: 'All 19 divisions of the octave',
                        tempo: 130,
                        timeSignature: [4, 4],
                        notes: Array.from({length: 19}, (_, i) => ({
                            ratio: Math.pow(2, i/19),
                            duration: 0.2,
                            velocity: 0.7 + (i % 4) * 0.1
                        })).concat([{ ratio: 2.0, duration: 1.0, velocity: 0.9 }])
                    },
                    {
                        name: 'Meantone Approximation',
                        description: '19-TET as meantone temperament',
                        tempo: 100,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: Math.pow(2, 0/19), duration: 0.5, velocity: 0.8 },  // C
                            { ratio: Math.pow(2, 3/19), duration: 0.5, velocity: 0.8 },  // D
                            { ratio: Math.pow(2, 6/19), duration: 0.5, velocity: 0.8 },  // E
                            { ratio: Math.pow(2, 8/19), duration: 0.5, velocity: 0.8 },  // F
                            { ratio: Math.pow(2, 11/19), duration: 0.5, velocity: 0.8 }, // G
                            { ratio: Math.pow(2, 14/19), duration: 0.5, velocity: 0.8 }, // A
                            { ratio: Math.pow(2, 17/19), duration: 0.5, velocity: 0.8 }, // B
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 }                // C
                        ]
                    },
                    {
                        name: 'Microtonal Thirds',
                        description: 'Exploring 19-TET third variations',
                        tempo: 80,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.0, velocity: 0.8 },
                            { ratio: Math.pow(2, 5/19), duration: 1.0, velocity: 0.8 },  // Minor third
                            { ratio: Math.pow(2, 6/19), duration: 1.0, velocity: 0.8 },  // Major third
                            { ratio: Math.pow(2, 7/19), duration: 1.0, velocity: 0.8 },  // Supermajor third
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 }
                        ]
                    },
                    {
                        name: 'Blackwood Decatonic',
                        description: 'Easley Blackwood 10-note scale in 19-TET',
                        tempo: 110,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: Math.pow(2, 0/19), duration: 0.4, velocity: 0.8 },
                            { ratio: Math.pow(2, 2/19), duration: 0.4, velocity: 0.7 },
                            { ratio: Math.pow(2, 4/19), duration: 0.4, velocity: 0.8 },
                            { ratio: Math.pow(2, 6/19), duration: 0.4, velocity: 0.7 },
                            { ratio: Math.pow(2, 8/19), duration: 0.4, velocity: 0.8 },
                            { ratio: Math.pow(2, 10/19), duration: 0.4, velocity: 0.7 },
                            { ratio: Math.pow(2, 12/19), duration: 0.4, velocity: 0.8 },
                            { ratio: Math.pow(2, 14/19), duration: 0.4, velocity: 0.7 },
                            { ratio: Math.pow(2, 16/19), duration: 0.4, velocity: 0.8 },
                            { ratio: Math.pow(2, 18/19), duration: 0.4, velocity: 0.7 },
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 }
                        ]
                    }
                ]
            },

            'turkish-53': {
                name: 'Turkish Makam',
                sequences: [
                    {
                        name: 'Makam Hicaz',
                        description: 'Classic Turkish makam with distinctive augmented second',
                        tempo: 90,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.0, velocity: 0.8 },       // A (Dügâh)
                            { ratio: 1.067, duration: 0.5, velocity: 0.7 },     // B♭- (4 commas flat)
                            { ratio: 1.26, duration: 1.0, velocity: 0.8 },      // C# (Dik Hicaz)
                            { ratio: 1.333, duration: 0.5, velocity: 0.7 },     // D (Nevâ) 
                            { ratio: 1.5, duration: 1.0, velocity: 0.8 },       // E (Hüseynî)
                            { ratio: 1.6, duration: 0.5, velocity: 0.7 },       // F (Acem)
                            { ratio: 1.778, duration: 0.5, velocity: 0.7 },     // G (Gerdâniye)
                            { ratio: 2.0, duration: 1.5, velocity: 0.9 }        // A octave
                        ]
                    },
                    {
                        name: 'Makam Rast',
                        description: 'Fundamental Turkish makam bringing happiness and tranquility',
                        tempo: 100,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 0.75, velocity: 0.8 },      // G (Rast)
                            { ratio: 1.125, duration: 0.5, velocity: 0.7 },     // A (Dügâh)
                            { ratio: 1.266, duration: 0.75, velocity: 0.8 },    // B (Segâh)
                            { ratio: 1.333, duration: 0.5, velocity: 0.7 },     // C (Çârgâh)
                            { ratio: 1.5, duration: 0.75, velocity: 0.8 },      // D (Nevâ)
                            { ratio: 1.688, duration: 0.5, velocity: 0.7 },     // E (Hüseynî)
                            { ratio: 1.78, duration: 0.5, velocity: 0.7 },      // F (Acem - descending)
                            { ratio: 2.0, duration: 1.5, velocity: 0.9 }        // G octave
                        ]
                    },
                    {
                        name: 'Makam Uşşâk',
                        description: 'Beloved makam often used in prayer calls',
                        tempo: 85,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.0, velocity: 0.8 },       // A (Dügâh)
                            { ratio: 1.09, duration: 0.5, velocity: 0.7 },      // B♭- (Kürdî)
                            { ratio: 1.2, duration: 0.5, velocity: 0.7 },       // C (Bûselik)
                            { ratio: 1.333, duration: 1.0, velocity: 0.8 },     // D (Nevâ)
                            { ratio: 1.5, duration: 0.75, velocity: 0.8 },      // E (Hüseynî)
                            { ratio: 1.6, duration: 0.5, velocity: 0.7 },       // F (Acem)
                            { ratio: 1.778, duration: 0.25, velocity: 0.6 },    // G (Rast)
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 }        // A octave
                        ]
                    },
                    {
                        name: 'Semazen Whirling',
                        description: 'Mystical Sufi melody for spiritual dance',
                        tempo: 110,
                        timeSignature: [9, 8],
                        notes: [
                            { ratio: 1.0, duration: 0.67, velocity: 0.8 },      // A
                            { ratio: 1.333, duration: 0.33, velocity: 0.6 },    // D
                            { ratio: 1.5, duration: 0.67, velocity: 0.8 },      // E
                            { ratio: 1.067, duration: 0.33, velocity: 0.6 },    // B♭-
                            { ratio: 1.26, duration: 0.33, velocity: 0.7 },     // C#
                            { ratio: 1.333, duration: 0.67, velocity: 0.8 },    // D
                            { ratio: 1.0, duration: 0.33, velocity: 0.7 },      // A
                            { ratio: 1.5, duration: 0.67, velocity: 0.8 },      // E
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 }        // A octave
                        ]
                    }
                ]
            },

            'persian': {
                name: 'Persian Dastgah',
                sequences: [
                    {
                        name: 'Dastgah Shur',
                        description: 'Most beloved Persian mode expressing melancholy and longing',
                        tempo: 75,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.5, velocity: 0.8 },       // D (Shâhgah)
                            { ratio: 1.067, duration: 0.5, velocity: 0.6 },     // E♭- (quarter flat)
                            { ratio: 1.185, duration: 1.0, velocity: 0.7 },     // F (Delkash)
                            { ratio: 1.333, duration: 1.0, velocity: 0.8 },     // G (Chahargah)
                            { ratio: 1.5, duration: 1.5, velocity: 0.9 },       // A (Panjgah)
                            { ratio: 1.6, duration: 0.5, velocity: 0.6 },       // B♭ (slight flat)
                            { ratio: 1.778, duration: 1.0, velocity: 0.7 },     // C (Haftgah)
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 }        // D octave
                        ]
                    },
                    {
                        name: 'Dastgah Mahur',
                        description: 'Majestic mode similar to Western major but with Persian character',
                        tempo: 95,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 0.75, velocity: 0.8 },      // C
                            { ratio: 1.125, duration: 0.5, velocity: 0.7 },     // D
                            { ratio: 1.266, duration: 0.75, velocity: 0.8 },    // E (slightly high)
                            { ratio: 1.333, duration: 0.5, velocity: 0.7 },     // F
                            { ratio: 1.5, duration: 0.75, velocity: 0.8 },      // G
                            { ratio: 1.688, duration: 0.5, velocity: 0.7 },     // A
                            { ratio: 1.898, duration: 0.5, velocity: 0.7 },     // B
                            { ratio: 2.0, duration: 1.5, velocity: 0.9 }        // C octave
                        ]
                    },
                    {
                        name: 'Dastgah Segah',
                        description: 'Complex mode with neutral thirds, profound and contemplative',
                        tempo: 70,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 2.0, velocity: 0.8 },       // E♭ (Segah root)
                            { ratio: 1.09, duration: 1.0, velocity: 0.7 },      // F (neutral)
                            { ratio: 1.22, duration: 1.0, velocity: 0.7 },      // G (neutral third)
                            { ratio: 1.333, duration: 1.5, velocity: 0.8 },     // A♭
                            { ratio: 1.45, duration: 0.5, velocity: 0.6 },      // B♭- (quarter flat)
                            { ratio: 1.63, duration: 1.0, velocity: 0.7 },      // C (neutral)
                            { ratio: 1.778, duration: 1.0, velocity: 0.7 },     // D♭
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 }        // E♭ octave
                        ]
                    },
                    {
                        name: 'Persian Tahrir',
                        description: 'Virtuosic vocal ornament technique in Persian classical music',
                        tempo: 60,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.5, duration: 1.0, velocity: 0.9 },       // Start high (A)
                            { ratio: 1.52, duration: 0.125, velocity: 0.5 },    // Microtonal ornament
                            { ratio: 1.48, duration: 0.125, velocity: 0.5 },    // Microtonal ornament
                            { ratio: 1.5, duration: 0.25, velocity: 0.7 },      // Return
                            { ratio: 1.333, duration: 0.75, velocity: 0.8 },    // Drop to G
                            { ratio: 1.35, duration: 0.125, velocity: 0.4 },    // Ornament
                            { ratio: 1.31, duration: 0.125, velocity: 0.4 },    // Ornament
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 },       // Resolve to root
                            { ratio: 1.067, duration: 0.5, velocity: 0.6 },     // Final grace note
                            { ratio: 1.0, duration: 1.0, velocity: 0.8 }        // Final resolution
                        ]
                    }
                ]
            },

            'carnatic': {
                name: 'Carnatic Classical',
                sequences: [
                    {
                        name: 'Raga Bhairav - Aarohana/Avarohana',
                        description: 'Classic morning raga with different ascending/descending patterns',
                        tempo: 90,
                        timeSignature: [4, 4],
                        notes: [
                            // Aarohana (ascending): S r G M P d N S
                            { ratio: 1.0, duration: 0.5, velocity: 0.8 },       // Sa
                            { ratio: 1.067, duration: 0.5, velocity: 0.8 },     // Komal Re (16/15)
                            { ratio: 1.25, duration: 0.5, velocity: 0.8 },      // Shuddha Ga (5/4)
                            { ratio: 1.333, duration: 0.5, velocity: 0.8 },     // Ma (4/3)
                            { ratio: 1.5, duration: 0.5, velocity: 0.8 },       // Pa (3/2)
                            { ratio: 1.6, duration: 0.5, velocity: 0.8 },       // Komal Dha (8/5)
                            { ratio: 1.875, duration: 0.5, velocity: 0.8 },     // Shuddha Ni (15/8)
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 },       // Sa (octave)
                            // Avarohana (descending): S N d P M G r S
                            { ratio: 1.875, duration: 0.5, velocity: 0.7 },     // Ni
                            { ratio: 1.6, duration: 0.5, velocity: 0.7 },       // Dha
                            { ratio: 1.5, duration: 0.5, velocity: 0.7 },       // Pa
                            { ratio: 1.333, duration: 0.5, velocity: 0.7 },     // Ma
                            { ratio: 1.25, duration: 0.5, velocity: 0.7 },      // Ga
                            { ratio: 1.067, duration: 0.5, velocity: 0.7 },     // Re
                            { ratio: 1.0, duration: 1.5, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Todi - Microtonal Magic',
                        description: 'Quintessential Carnatic raga with extreme microtonal intervals',
                        tempo: 70,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.0, velocity: 0.9 },       // Sa
                            { ratio: 1.053, duration: 0.75, velocity: 0.8 },    // Komal Re (17/16) - microtonal
                            { ratio: 1.2, duration: 0.5, velocity: 0.8 },       // Komal Ga (6/5)
                            { ratio: 1.26, duration: 0.25, velocity: 0.6 },     // Gamaka ornament
                            { ratio: 1.2, duration: 0.5, velocity: 0.8 },       // Return to Ga
                            { ratio: 1.424, duration: 0.75, velocity: 0.8 },    // Tivra Ma (45/32)
                            { ratio: 1.5, duration: 1.0, velocity: 0.9 },       // Pa
                            { ratio: 1.6, duration: 0.5, velocity: 0.8 },       // Komal Dha
                            { ratio: 1.875, duration: 0.75, velocity: 0.8 },    // Shuddha Ni
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 }        // Sa (octave)
                        ]
                    },
                    {
                        name: 'Raga Kharaharapriya - Vakra Phrases',
                        description: 'Crooked melodic patterns defying linear scale progression',
                        tempo: 100,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 0.5, velocity: 0.8 },       // Sa
                            { ratio: 1.125, duration: 0.5, velocity: 0.8 },     // Re
                            { ratio: 1.2, duration: 0.5, velocity: 0.8 },       // Ga
                            { ratio: 1.125, duration: 0.25, velocity: 0.6 },    // Vakra - back to Re
                            { ratio: 1.333, duration: 0.75, velocity: 0.8 },    // Jump to Ma
                            { ratio: 1.2, duration: 0.25, velocity: 0.6 },      // Vakra - back to Ga
                            { ratio: 1.5, duration: 0.75, velocity: 0.8 },      // Jump to Pa
                            { ratio: 1.688, duration: 0.5, velocity: 0.8 },     // Dha
                            { ratio: 1.5, duration: 0.25, velocity: 0.6 },      // Vakra - back to Pa
                            { ratio: 1.688, duration: 0.25, velocity: 0.7 },    // Dha again
                            { ratio: 1.9, duration: 0.5, velocity: 0.8 },       // Ni
                            { ratio: 2.0, duration: 1.5, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Kalyani - Gamaka Ornaments',
                        description: 'Beautiful melodic curves and microtonal slides',
                        tempo: 80,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.0, velocity: 0.9 },       // Sa
                            { ratio: 1.125, duration: 0.5, velocity: 0.8 },     // Re
                            { ratio: 1.135, duration: 0.1, velocity: 0.4 },     // Gamaka slide
                            { ratio: 1.25, duration: 0.9, velocity: 0.8 },      // Ga with approach
                            { ratio: 1.424, duration: 0.75, velocity: 0.8 },    // Tivra Ma
                            { ratio: 1.44, duration: 0.1, velocity: 0.5 },      // Gamaka curve
                            { ratio: 1.408, duration: 0.15, velocity: 0.5 },    // Gamaka curve
                            { ratio: 1.424, duration: 0.5, velocity: 0.8 },     // Return to Ma
                            { ratio: 1.5, duration: 1.0, velocity: 0.9 },       // Pa
                            { ratio: 1.688, duration: 0.5, velocity: 0.8 },     // Dha
                            { ratio: 1.875, duration: 0.75, velocity: 0.8 },    // Ni
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Mohanam - Pentatonic Beauty',
                        description: 'Devotional pentatonic raga with ethereal quality',
                        tempo: 65,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.5, velocity: 0.9 },       // Sa
                            { ratio: 1.125, duration: 1.0, velocity: 0.8 },     // Re
                            { ratio: 1.25, duration: 1.0, velocity: 0.8 },      // Ga
                            { ratio: 1.5, duration: 1.5, velocity: 0.9 },       // Pa (skip Ma)
                            { ratio: 1.688, duration: 1.0, velocity: 0.8 },     // Dha
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 },       // Sa (skip Ni)
                            // Descending with gamakas
                            { ratio: 1.688, duration: 0.75, velocity: 0.7 },    // Dha
                            { ratio: 1.7, duration: 0.1, velocity: 0.4 },       // Gamaka
                            { ratio: 1.675, duration: 0.15, velocity: 0.4 },    // Gamaka
                            { ratio: 1.5, duration: 1.0, velocity: 0.8 },       // Pa
                            { ratio: 1.25, duration: 1.0, velocity: 0.8 },      // Ga
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Shankarabharanam - Complete 22 Sruti',
                        description: 'Major-like raga showcasing the full microtonal palette',
                        tempo: 110,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 0.5, velocity: 0.8 },       // Sa (1st sruti)
                            { ratio: 1.041, duration: 0.25, velocity: 0.6 },    // Intermediate sruti
                            { ratio: 1.125, duration: 0.5, velocity: 0.8 },     // Re (5th sruti)
                            { ratio: 1.185, duration: 0.25, velocity: 0.6 },    // Intermediate sruti
                            { ratio: 1.25, duration: 0.5, velocity: 0.8 },      // Ga (7th sruti)
                            { ratio: 1.333, duration: 0.5, velocity: 0.8 },     // Ma (11th sruti)
                            { ratio: 1.383, duration: 0.25, velocity: 0.6 },    // Intermediate sruti
                            { ratio: 1.5, duration: 0.5, velocity: 0.8 },       // Pa (15th sruti)
                            { ratio: 1.563, duration: 0.25, velocity: 0.6 },    // Intermediate sruti
                            { ratio: 1.688, duration: 0.5, velocity: 0.8 },     // Dha (19th sruti)
                            { ratio: 1.781, duration: 0.25, velocity: 0.6 },    // Intermediate sruti
                            { ratio: 1.875, duration: 0.5, velocity: 0.8 },     // Ni (21st sruti)
                            { ratio: 2.0, duration: 1.5, velocity: 0.9 }        // Sa (22nd sruti/octave)
                        ]
                    },
                    {
                        name: 'Raga Hindolam - Mystical Pentatonic',
                        description: 'Ancient raga evoking the divine swing (equivalent to Malkauns)',
                        tempo: 55,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 },       // Sa
                            { ratio: 1.2, duration: 1.5, velocity: 0.8 },       // Komal Ga
                            { ratio: 1.215, duration: 0.15, velocity: 0.5 },    // Gamaka ornament
                            { ratio: 1.185, duration: 0.15, velocity: 0.5 },    // Gamaka ornament
                            { ratio: 1.2, duration: 0.7, velocity: 0.8 },       // Return to Ga
                            { ratio: 1.333, duration: 1.5, velocity: 0.8 },     // Ma
                            { ratio: 1.6, duration: 1.5, velocity: 0.8 },       // Komal Dha
                            { ratio: 1.775, duration: 1.5, velocity: 0.8 },     // Komal Ni
                            { ratio: 2.0, duration: 3.0, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Abheri - Evening Contemplation',
                        description: 'Deeply emotional raga with characteristic komal intervals',
                        tempo: 75,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.0, velocity: 0.9 },       // Sa
                            { ratio: 1.125, duration: 0.75, velocity: 0.8 },    // Re
                            { ratio: 1.2, duration: 1.0, velocity: 0.8 },       // Komal Ga
                            { ratio: 1.333, duration: 0.75, velocity: 0.8 },    // Ma
                            { ratio: 1.5, duration: 1.0, velocity: 0.9 },       // Pa
                            { ratio: 1.6, duration: 0.75, velocity: 0.8 },      // Komal Dha
                            { ratio: 1.775, duration: 0.75, velocity: 0.8 },    // Komal Ni
                            { ratio: 2.0, duration: 1.5, velocity: 0.9 },       // Sa
                            // Characteristic avarohana with gamakas
                            { ratio: 1.775, duration: 0.5, velocity: 0.7 },     // Ni
                            { ratio: 1.6, duration: 0.5, velocity: 0.7 },       // Dha
                            { ratio: 1.5, duration: 0.75, velocity: 0.8 },      // Pa
                            { ratio: 1.333, duration: 0.5, velocity: 0.7 },     // Ma
                            { ratio: 1.2, duration: 0.75, velocity: 0.8 },      // Ga with gamaka
                            { ratio: 1.125, duration: 0.5, velocity: 0.7 },     // Re
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 }        // Sa
                        ]
                    }
                ]
            },

            'hindustani': {
                name: 'Hindustani Classical',
                sequences: [
                    {
                        name: 'Raga Yaman - King of Ragas',
                        description: 'Evening raga with tivra madhyam, different aarohana/avarohana',
                        tempo: 95,
                        timeSignature: [4, 4],
                        notes: [
                            // Aarohana: Ni Re Ga Ma Dha Ni Sa (starts from Ni below)
                            { ratio: 0.9375, duration: 0.5, velocity: 0.7 },    // Ni (below)
                            { ratio: 1.125, duration: 0.5, velocity: 0.8 },     // Re
                            { ratio: 1.25, duration: 0.5, velocity: 0.8 },      // Ga
                            { ratio: 1.424, duration: 0.75, velocity: 0.8 },    // Tivra Ma (45/32)
                            { ratio: 1.688, duration: 0.5, velocity: 0.8 },     // Dha
                            { ratio: 1.875, duration: 0.5, velocity: 0.8 },     // Ni
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 },       // Sa
                            // Avarohana: Sa Ni Dha Pa Ma Ga Re Sa (includes Pa)
                            { ratio: 1.875, duration: 0.5, velocity: 0.7 },     // Ni
                            { ratio: 1.688, duration: 0.5, velocity: 0.7 },     // Dha
                            { ratio: 1.5, duration: 0.5, velocity: 0.8 },       // Pa (only in avarohana)
                            { ratio: 1.424, duration: 0.5, velocity: 0.7 },     // Ma
                            { ratio: 1.25, duration: 0.5, velocity: 0.7 },      // Ga
                            { ratio: 1.125, duration: 0.5, velocity: 0.7 },     // Re
                            { ratio: 1.0, duration: 1.5, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Bhairav - Dawn Awakening',
                        description: 'Sacred morning raga with komal re and komal dha',
                        tempo: 80,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.5, velocity: 0.9 },       // Sa
                            { ratio: 1.067, duration: 1.0, velocity: 0.8 },     // Komal Re (16/15)
                            { ratio: 1.25, duration: 1.0, velocity: 0.8 },      // Shuddha Ga
                            { ratio: 1.333, duration: 1.0, velocity: 0.8 },     // Ma
                            { ratio: 1.5, duration: 1.5, velocity: 0.9 },       // Pa
                            { ratio: 1.6, duration: 1.0, velocity: 0.8 },       // Komal Dha (8/5)
                            { ratio: 1.875, duration: 1.0, velocity: 0.8 },     // Shuddha Ni
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 },       // Sa
                            // Characteristic phrase with meend
                            { ratio: 1.875, duration: 0.5, velocity: 0.7 },     // Ni
                            { ratio: 1.6, duration: 0.75, velocity: 0.8 },      // Dha with emphasis
                            { ratio: 1.5, duration: 0.75, velocity: 0.8 },      // Pa
                            { ratio: 1.067, duration: 1.0, velocity: 0.8 },     // Komal Re (important)
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Darbari Kanada - Royal Grandeur',
                        description: 'Midnight raga with ati-komal gandhar and complex gamakas',
                        tempo: 60,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 },       // Sa
                            { ratio: 1.125, duration: 1.0, velocity: 0.8 },     // Re
                            { ratio: 1.17, duration: 1.5, velocity: 0.8 },      // Ati-komal Ga (19/16)
                            { ratio: 1.16, duration: 0.2, velocity: 0.5 },      // Gamaka oscillation
                            { ratio: 1.18, duration: 0.2, velocity: 0.5 },      // Gamaka oscillation
                            { ratio: 1.17, duration: 0.6, velocity: 0.8 },      // Return to Ga
                            { ratio: 1.333, duration: 1.5, velocity: 0.8 },     // Ma
                            { ratio: 1.5, duration: 2.0, velocity: 0.9 },       // Pa (strong)
                            { ratio: 1.6, duration: 1.0, velocity: 0.8 },       // Komal Dha
                            { ratio: 1.775, duration: 1.0, velocity: 0.8 },     // Komal Ni
                            { ratio: 2.0, duration: 3.0, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Malkauns - Shiva\'s Raga',
                        description: 'Pentatonic midnight raga omitting Re and Pa',
                        tempo: 55,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 0.89, duration: 1.0, velocity: 0.7 },      // Komal Ni (below)
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 },       // Sa
                            { ratio: 1.2, duration: 1.5, velocity: 0.8 },       // Komal Ga
                            { ratio: 1.333, duration: 1.5, velocity: 0.8 },     // Ma
                            { ratio: 1.6, duration: 1.5, velocity: 0.8 },       // Komal Dha
                            { ratio: 1.775, duration: 1.5, velocity: 0.8 },     // Komal Ni
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 },       // Sa
                            // Characteristic descending phrase
                            { ratio: 1.775, duration: 1.0, velocity: 0.7 },     // Ni
                            { ratio: 1.6, duration: 1.0, velocity: 0.8 },       // Dha
                            { ratio: 1.333, duration: 1.0, velocity: 0.8 },     // Ma
                            { ratio: 1.2, duration: 1.0, velocity: 0.8 },       // Ga
                            { ratio: 1.0, duration: 3.0, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Bhimpalasi - Afternoon Melancholy',
                        description: 'Audava-Sampurna raga with asymmetric aarohana/avarohana',
                        tempo: 85,
                        timeSignature: [4, 4],
                        notes: [
                            // Aarohana (5 notes): Sa Ga Ma Pa Ni Sa
                            { ratio: 1.0, duration: 0.75, velocity: 0.8 },      // Sa
                            { ratio: 1.2, duration: 0.75, velocity: 0.8 },      // Komal Ga
                            { ratio: 1.333, duration: 0.75, velocity: 0.8 },    // Ma (vadi)
                            { ratio: 1.5, duration: 0.75, velocity: 0.8 },      // Pa
                            { ratio: 1.775, duration: 0.75, velocity: 0.8 },    // Komal Ni
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 },       // Sa
                            // Avarohana (7 notes): Sa Ni Dha Pa Ma Ga Re Sa
                            { ratio: 1.775, duration: 0.5, velocity: 0.7 },     // Ni
                            { ratio: 1.6, duration: 0.5, velocity: 0.8 },       // Dha (only in avarohana)
                            { ratio: 1.5, duration: 0.5, velocity: 0.7 },       // Pa
                            { ratio: 1.333, duration: 0.75, velocity: 0.8 },    // Ma (emphasis)
                            { ratio: 1.2, duration: 0.5, velocity: 0.7 },       // Ga
                            { ratio: 1.125, duration: 0.5, velocity: 0.8 },     // Re (only in avarohana)
                            { ratio: 1.0, duration: 1.5, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Todi - Ultimate Microtonal Challenge',
                        description: 'Most complex raga with extreme microtonal intervals and gamakas',
                        tempo: 65,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.5, velocity: 0.9 },       // Sa
                            { ratio: 1.053, duration: 1.0, velocity: 0.8 },     // Komal Re (17/16)
                            { ratio: 1.046, duration: 0.15, velocity: 0.4 },    // Gamaka below
                            { ratio: 1.06, duration: 0.15, velocity: 0.4 },     // Gamaka above
                            { ratio: 1.053, duration: 0.7, velocity: 0.8 },     // Return to Re
                            { ratio: 1.2, duration: 1.0, velocity: 0.8 },       // Komal Ga
                            { ratio: 1.424, duration: 1.5, velocity: 0.8 },     // Tivra Ma (45/32)
                            { ratio: 1.5, duration: 1.5, velocity: 0.9 },       // Pa
                            { ratio: 1.6, duration: 1.0, velocity: 0.8 },       // Komal Dha
                            { ratio: 1.875, duration: 1.0, velocity: 0.8 },     // Shuddha Ni
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 },       // Sa
                            // Complex gamaka phrase
                            { ratio: 1.875, duration: 0.5, velocity: 0.7 },     // Ni
                            { ratio: 1.424, duration: 0.75, velocity: 0.8 },    // Jump to Ma
                            { ratio: 1.44, duration: 0.1, velocity: 0.4 },      // Gamaka ornament
                            { ratio: 1.408, duration: 0.15, velocity: 0.4 },    // Gamaka ornament
                            { ratio: 1.2, duration: 1.0, velocity: 0.8 },       // Slide to Ga
                            { ratio: 1.053, duration: 0.75, velocity: 0.8 },    // Re
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Bageshri - Devotional Evening',
                        description: 'Late evening raga with characteristic komal ni and gamakas',
                        tempo: 75,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.0, velocity: 0.9 },       // Sa
                            { ratio: 1.125, duration: 0.75, velocity: 0.8 },    // Re
                            { ratio: 1.333, duration: 1.0, velocity: 0.8 },     // Ma (important)
                            { ratio: 1.5, duration: 1.5, velocity: 0.9 },       // Pa (vadi)
                            { ratio: 1.688, duration: 0.75, velocity: 0.8 },    // Dha
                            { ratio: 1.775, duration: 1.0, velocity: 0.8 },     // Komal Ni
                            { ratio: 2.0, duration: 1.5, velocity: 0.9 },       // Sa
                            // Characteristic phrase with meend
                            { ratio: 1.775, duration: 0.5, velocity: 0.7 },     // Ni
                            { ratio: 1.688, duration: 0.75, velocity: 0.8 },    // Dha
                            { ratio: 1.5, duration: 1.0, velocity: 0.9 },       // Pa (sustain)
                            { ratio: 1.333, duration: 0.75, velocity: 0.8 },    // Ma
                            { ratio: 1.125, duration: 0.5, velocity: 0.7 },     // Re
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 }        // Sa
                        ]
                    },
                    {
                        name: 'Raga Puriya Dhanashri - Microtonal Wonder',
                        description: 'Complex evening raga with both Ma variants and intricate gamakas',
                        tempo: 70,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 1.5, velocity: 0.9 },       // Sa
                            { ratio: 1.067, duration: 0.75, velocity: 0.8 },    // Komal Re
                            { ratio: 1.25, duration: 0.75, velocity: 0.8 },     // Shuddha Ga
                            { ratio: 1.333, duration: 0.5, velocity: 0.7 },     // Shuddha Ma
                            { ratio: 1.424, duration: 1.0, velocity: 0.8 },     // Tivra Ma (both Ma used)
                            { ratio: 1.5, duration: 1.5, velocity: 0.9 },       // Pa
                            { ratio: 1.6, duration: 0.75, velocity: 0.8 },      // Komal Dha
                            { ratio: 1.875, duration: 0.75, velocity: 0.8 },    // Shuddha Ni
                            { ratio: 2.0, duration: 2.0, velocity: 0.9 },       // Sa
                            // Gamaka-rich phrase
                            { ratio: 1.875, duration: 0.4, velocity: 0.7 },     // Ni
                            { ratio: 1.89, duration: 0.1, velocity: 0.4 },      // Gamaka
                            { ratio: 1.86, duration: 0.1, velocity: 0.4 },      // Gamaka
                            { ratio: 1.424, duration: 1.0, velocity: 0.8 },     // Ma
                            { ratio: 1.25, duration: 0.75, velocity: 0.8 },     // Ga
                            { ratio: 1.067, duration: 0.75, velocity: 0.8 },    // Re
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 }        // Sa
                        ]
                    }
                ]
            },

            'overtones': {
                name: 'Overtones',
                sequences: [
                    {
                        name: 'Natural Harmonic Series',
                        description: 'Pure overtones 1-16',
                        tempo: 100,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 2.0, velocity: 0.9 },   // 1st harmonic
                            { ratio: 2.0, duration: 1.0, velocity: 0.8 },   // 2nd harmonic
                            { ratio: 3.0, duration: 0.67, velocity: 0.7 },  // 3rd harmonic
                            { ratio: 4.0, duration: 0.5, velocity: 0.7 },   // 4th harmonic
                            { ratio: 5.0, duration: 0.4, velocity: 0.6 },   // 5th harmonic
                            { ratio: 6.0, duration: 0.33, velocity: 0.6 },  // 6th harmonic
                            { ratio: 7.0, duration: 0.29, velocity: 0.5 },  // 7th harmonic
                            { ratio: 8.0, duration: 0.25, velocity: 0.5 }   // 8th harmonic
                        ]
                    },
                    {
                        name: 'Horn Call',
                        description: 'Natural horn overtones',
                        tempo: 80,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 2.0, duration: 1.0, velocity: 0.8 },   // 2nd
                            { ratio: 3.0, duration: 1.0, velocity: 0.8 },   // 3rd
                            { ratio: 4.0, duration: 0.5, velocity: 0.8 },   // 4th
                            { ratio: 5.0, duration: 0.5, velocity: 0.8 },   // 5th
                            { ratio: 6.0, duration: 0.5, velocity: 0.8 },   // 6th
                            { ratio: 8.0, duration: 0.5, velocity: 0.8 },   // 8th
                            { ratio: 4.0, duration: 2.0, velocity: 0.9 }    // Return to 4th
                        ]
                    },
                    {
                        name: 'Spectral Harmony',
                        description: 'Modern spectral music technique',
                        tempo: 60,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 1.0, duration: 4.0, velocity: 0.9 },
                            { ratio: 2.0, duration: 4.0, velocity: 0.8 },
                            { ratio: 3.0, duration: 4.0, velocity: 0.7 },
                            { ratio: 4.0, duration: 4.0, velocity: 0.6 },
                            { ratio: 5.0, duration: 4.0, velocity: 0.5 },
                            { ratio: 6.0, duration: 4.0, velocity: 0.4 },
                            { ratio: 7.0, duration: 4.0, velocity: 0.3 }
                        ]
                    },
                    {
                        name: 'Brass Fanfare',
                        description: 'Bugle call harmonics',
                        tempo: 120,
                        timeSignature: [4, 4],
                        notes: [
                            { ratio: 2.0, duration: 0.5, velocity: 0.9 },
                            { ratio: 3.0, duration: 0.5, velocity: 0.8 },
                            { ratio: 4.0, duration: 0.5, velocity: 0.8 },
                            { ratio: 5.0, duration: 0.5, velocity: 0.8 },
                            { ratio: 6.0, duration: 0.5, velocity: 0.8 },
                            { ratio: 4.0, duration: 0.5, velocity: 0.8 },
                            { ratio: 3.0, duration: 0.5, velocity: 0.8 },
                            { ratio: 2.0, duration: 1.0, velocity: 0.9 }
                        ]
                    }
                ]
            }
        };
    }

    getSequencesForSystem(systemId) {
        return this.sequences[systemId] || null;
    }

    getDefaultSequence(systemId) {
        const system = this.sequences[systemId];
        return system ? system.sequences[0] : null;
    }

    // Convert note names to frequency ratios
    noteToRatio(noteName, baseFreq = 220) {
        if (typeof noteName === 'object' && noteName.ratio) {
            return noteName.ratio;
        }
        
        // Simple note name parsing (C4, D#5, etc.)
        const noteMap = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
            'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
            'A#': 10, 'Bb': 10, 'B': 11
        };
        
        const match = noteName.match(/([A-G][#b]?)(\d+)/);
        if (!match) return 1.0;
        
        const [, note, octave] = match;
        const semitones = noteMap[note] + (parseInt(octave) - 4) * 12;
        return Math.pow(2, semitones / 12);
    }

    // Map a sequence from one tuning system to another
    mapSequenceToSystem(sequence, fromSystemId, toSystemId, microtunaInstance) {
        if (!sequence || !microtunaInstance) return null;
        
        const mappedSequence = {
            ...sequence,
            name: `${sequence.name} (mapped to ${this.sequences[toSystemId]?.name || toSystemId})`,
            notes: []
        };

        // Get the angle calculations for both systems
        const fromAngles = this.getTuningSystemAngles(fromSystemId, microtunaInstance);
        const toAngles = this.getTuningSystemAngles(toSystemId, microtunaInstance);
        
        if (!fromAngles || !toAngles) return null;

        sequence.notes.forEach(note => {
            let targetRatio = note.ratio || this.noteToRatio(note.note);
            
            // Find the closest angle in the source system
            const targetAngle = Math.log2(targetRatio) * 2 * Math.PI;
            let closestFromAngle = fromAngles.reduce((prev, curr) => 
                Math.abs(curr.angle - targetAngle) < Math.abs(prev.angle - targetAngle) ? curr : prev
            );

            // Find the closest corresponding angle in the target system
            let closestToAngle = toAngles.reduce((prev, curr) => 
                Math.abs(curr.angle - closestFromAngle.angle) < Math.abs(prev.angle - closestFromAngle.angle) ? curr : prev
            );

            mappedSequence.notes.push({
                ...note,
                ratio: closestToAngle.frequency / 220, // Normalize to A3 = 220Hz
                originalNote: note.note || `${targetRatio.toFixed(3)}`,
                mappedNote: closestToAngle.note || `${closestToAngle.frequency.toFixed(1)}Hz`
            });
        });

        return mappedSequence;
    }

    getTuningSystemAngles(systemId, microtunaInstance) {
        const system = microtunaInstance.tuningSystemsData[systemId];
        if (!system || !system.calculateAngles) return null;
        
        try {
            return system.calculateAngles();
        } catch (e) {
            console.warn(`Could not calculate angles for ${systemId}:`, e);
            return null;
        }
    }

    // Piano roll visualization data
    generatePianoRollData(sequence, systemId) {
        if (!sequence) return null;
        
        const rollData = {
            sequence: sequence,
            systemId: systemId,
            totalDuration: sequence.notes.reduce((sum, note) => sum + note.duration, 0),
            tracks: [{
                name: 'Main',
                notes: sequence.notes.map((note, index) => {
                    let startTime = sequence.notes.slice(0, index).reduce((sum, n) => sum + n.duration, 0);
                    return {
                        index: index,
                        startTime: startTime,
                        duration: note.duration,
                        ratio: note.ratio || this.noteToRatio(note.note),
                        velocity: note.velocity || 0.8,
                        note: note.note || `${(note.ratio || 1).toFixed(3)}`,
                        originalNote: note.originalNote,
                        mappedNote: note.mappedNote
                    };
                })
            }]
        };
        
        return rollData;
    }
}

// Export for use in main application
window.ArpSequencer = ArpSequencer;

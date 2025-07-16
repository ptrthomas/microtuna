/**
 * Microtuna - Music Scale Explorer
 * A web-based logarithmic spiral frequency visualizer for exploring harmonic relationships
 * between musical frequencies with multiple tuning system overlays and intelligent arpeggiator.
 * 
 * Copyright (c) 2025 Peter Thomas
 * Licensed under the MIT License - see LICENSE file for details
 */

class Microtuna {
    constructor() {
        this.canvas = document.getElementById('frequency-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pinnedPoints = new Map();
        this.arcsData = [];
        this.arcIndex = 0;
        
        // Audio setup
        this.audioContext = null;
        this.masterGain = null;
        this.audioEnabled = false;
        this.currentWaveType = 'sine';
        
        // Spiral parameters
        this.startFreq = 110; // A2 - one octave lower for better sequence visibility
        this.endFreq = 3520;  // A7
        this.spiralTurns = 4;
        this.spiralWidth = 12;
        this.baseOffset = 30;
        this.zoomLevel = 1.0; // New zoom parameter
        
        // Canvas state
        this.centerX = 0;
        this.centerY = 0;
        this.maxRadius = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.hovering = false;
        
        // Tuning systems
        this.activeTuningSystems = new Set();
        this.tuningSystemsData = this.initializeTuningSystems();
        
        // Arpeggiator state
        this.selectedTuningSystem = null;
        this.arpeggiatorVisible = false;
        this.arpPlaying = false;
        this.arpInterval = null;
        this.arpInstrument = 'guitar';
        
        // Sequence-based arpeggiator
        this.arpSequencer = null;
        this.currentSequence = null;
        this.currentSequenceIndex = 0;
        this.pianoRollCanvas = null;
        this.pianoRollCtx = null;
        this.pianoRollClickHandler = null;
        this.mappingMode = false;
        this.spiralSequenceMode = false; // New mode for showing sequences on spiral
        
        this.setupCanvas();
        this.setupEventListeners();
        this.setupAudioControls();
        this.setupTuningSystemsPanel();
        this.setupArpeggiator();
        this.draw();
    }
    
    initializeTuningSystems() {
        return {
            '12-tet': {
                name: '12-TET (Equal)',
                color: '#ffffff',
                style: 'solid',
                opacity: 0.8,
                offset: 0, // Base offset
                calculateAngles: () => this.calculate12TET()
            },
            'just': {
                name: 'Just Intonation',
                color: '#28a745',
                style: 'dashed',
                opacity: 0.7,
                offset: 15, // 15px further out
                calculateAngles: () => this.calculateJustIntonation()
            },
            'pythagorean': {
                name: 'Pythagorean',
                color: '#ffc107',
                style: 'dashed',
                opacity: 0.7,
                offset: 30, // 30px further out
                calculateAngles: () => this.calculatePythagorean()
            },
            'meantone': {
                name: 'Meantone',
                color: '#fd7e14',
                style: 'dashed',
                opacity: 0.6,
                offset: 45, // 45px further out
                calculateAngles: () => this.calculateMeantone()
            },
            '19-tet': {
                name: '19-TET',
                color: '#6f42c1',
                style: 'dotted',
                opacity: 0.6,
                offset: 60,
                calculateAngles: () => this.calculateNTET(19)
            },
            '31-tet': {
                name: '31-TET',
                color: '#e83e8c',
                style: 'dotted',
                opacity: 0.6,
                offset: 75,
                calculateAngles: () => this.calculateNTET(31)
            },
            '53-tet': {
                name: '53-TET',
                color: '#20c997',
                style: 'dotted',
                opacity: 0.6,
                offset: 90,
                calculateAngles: () => this.calculateNTET(53)
            },
            'overtones': {
                name: 'Overtones',
                color: '#17a2b8',
                style: 'solid',
                opacity: 0.7,
                offset: 105,
                calculateAngles: () => this.calculateOvertones()
            },
            'undertones': {
                name: 'Undertones',
                color: '#6c757d',
                style: 'solid',
                opacity: 0.6,
                offset: 120,
                calculateAngles: () => this.calculateUndertones()
            },
            'arabic-24': {
                name: 'Arabic 24-Quarter',
                color: '#d63384',
                style: 'solid',
                opacity: 0.7,
                offset: 135,
                calculateAngles: () => this.calculateArabic24Quarter()
            },
            'turkish-53': {
                name: 'Turkish Makam',
                color: '#dc3545',
                style: 'dashed',
                opacity: 0.7,
                offset: 150,
                calculateAngles: () => this.calculateTurkishMakam()
            },
            'persian': {
                name: 'Persian Dastgah',
                color: '#fd7e14',
                style: 'dashed',
                opacity: 0.7,
                offset: 165,
                calculateAngles: () => this.calculatePersianDastgah()
            },
            'carnatic': {
                name: 'Carnatic (22 Sruti)',
                color: '#ff6b35',
                style: 'solid',
                opacity: 0.8,
                offset: 180,
                calculateAngles: () => this.calculateCarnatic22Sruti()
            },
            'hindustani': {
                name: 'Hindustani (22 Sruti)',
                color: '#f7931e',
                style: 'dashed',
                opacity: 0.8,
                offset: 195,
                calculateAngles: () => this.calculateHindustani22Sruti()
            }
        };
    }
    
    setupCanvas() {
        const container = document.getElementById('canvas-container');
        const rect = container.getBoundingClientRect();
        
        // Set canvas size
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // Calculate drawing parameters - center spiral in available vertical space
        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2; // Keep centered vertically
        this.maxRadius = Math.min(rect.width, rect.height) * 0.35 * this.zoomLevel; // Apply zoom level
    }
    
    setupEventListeners() {
        // Canvas events
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.draw();
            // Re-setup piano roll if it's visible
            if (this.arpeggiatorVisible && this.pianoRollCanvas) {
                this.setupPianoRoll();
                if (this.currentSequence) {
                    this.renderPianoRoll();
                }
            }
        });
        
        // Clear all button
        document.getElementById('clear-all').addEventListener('click', () => {
            this.clearAllPoints();
        });
    }
    
    setupAudioControls() {
        const audioToggle = document.getElementById('audio-toggle');
        const waveTypeSelect = document.getElementById('wave-type');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeDisplay = document.getElementById('volume-display');
        
        audioToggle.addEventListener('click', () => {
            this.toggleAudio();
        });
        
        waveTypeSelect.addEventListener('change', (e) => {
            this.currentWaveType = e.target.value;
            this.updateAllOscillators();
        });
        
        volumeSlider.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value);
            volumeDisplay.textContent = volume + '%';
            if (this.masterGain) {
                this.masterGain.gain.value = volume / 100;
            }
        });
        
        // Zoom controls
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomDisplay = document.getElementById('zoom-display');
        
        if (zoomSlider && zoomDisplay) {
            zoomSlider.addEventListener('input', (e) => {
                this.zoomLevel = parseFloat(e.target.value);
                zoomDisplay.textContent = Math.round(this.zoomLevel * 100) + '%';
                this.setupCanvas(); // Recalculate maxRadius with new zoom
                this.draw(); // Redraw with new zoom
            });
        }
    }
    
    async toggleAudio() {
        const button = document.getElementById('audio-toggle');
        
        if (!this.audioEnabled) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.audioContext.createGain();
                this.masterGain.connect(this.audioContext.destination);
                
                const volume = parseInt(document.getElementById('volume-slider').value);
                this.masterGain.gain.value = volume / 100;
                
                this.audioEnabled = true;
                button.innerHTML = '<i class="bi bi-stop-fill"></i> Stop Audio';
                button.classList.add('active');
                
                // Start audio for all pinned points
                this.pinnedPoints.forEach((point, freq) => {
                    if (!point.muted) {
                        this.startOscillator(freq, point);
                    }
                });
                
            } catch (error) {
                console.error('Audio setup failed:', error);
            }
        } else {
            this.stopAllAudio();
            this.audioEnabled = false;
            button.innerHTML = '<i class="bi bi-play-fill"></i> Start Audio';
            button.classList.remove('active');
        }
    }
    
    startOscillator(frequency, point) {
        if (!this.audioEnabled || !this.audioContext) return;
        
        try {
            point.oscillator = this.audioContext.createOscillator();
            point.gain = this.audioContext.createGain();
            
            point.oscillator.frequency.value = frequency;
            point.oscillator.type = this.currentWaveType;
            point.gain.gain.value = 0.1;
            
            point.oscillator.connect(point.gain);
            point.gain.connect(this.masterGain);
            point.oscillator.start();
        } catch (error) {
            console.error('Oscillator start failed:', error);
        }
    }
    
    stopOscillator(point) {
        if (point.oscillator) {
            try {
                point.oscillator.stop();
                point.oscillator.disconnect();
                point.gain.disconnect();
            } catch (error) {
                console.error('Oscillator stop failed:', error);
            }
            point.oscillator = null;
            point.gain = null;
        }
    }
    
    stopAllAudio() {
        this.pinnedPoints.forEach(point => {
            this.stopOscillator(point);
        });
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
            this.masterGain = null;
        }
    }
    
    updateAllOscillators() {
        this.pinnedPoints.forEach((point, freq) => {
            if (point.oscillator) {
                point.oscillator.type = this.currentWaveType;
            }
        });
    }
    
    frequencyToSpiral(freq) {
        const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
        const radius = t * this.maxRadius;
        const angle = -Math.PI/2 + (t * this.spiralTurns * 2 * Math.PI);
        
        return {
            x: this.centerX + radius * Math.cos(angle),
            y: this.centerY + radius * Math.sin(angle),
            radius: radius,
            angle: angle,
            t: t
        };
    }
    
    pointToFrequency(x, y) {
        const dx = x - this.centerX;
        const dy = y - this.centerY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        
        if (radius > this.maxRadius) return null;
        
        const t = radius / this.maxRadius;
        return this.startFreq * Math.pow(2, t * this.spiralTurns);
    }
    
    findClosestSpiralPoint(x, y) {
        let closestDist = Infinity;
        let closestFreq = null;
        let closestSpiralPoint = null;
        
        // Sample spiral points with higher resolution for better accuracy
        for (let i = 0; i <= 2000; i++) {
            const t = i / 2000;
            const freq = this.startFreq * Math.pow(2, t * this.spiralTurns);
            const spiralPoint = this.frequencyToSpiral(freq);
            
            const dist = Math.sqrt(
                Math.pow(x - spiralPoint.x, 2) + 
                Math.pow(y - spiralPoint.y, 2)
            );
            
            if (dist < closestDist) {
                closestDist = dist;
                closestFreq = freq;
                closestSpiralPoint = spiralPoint;
            }
        }
        
        // Return frequency only if mouse is close enough to the spiral path
        return closestDist < this.spiralWidth / 2 ? { freq: closestFreq, point: closestSpiralPoint, distance: closestDist } : null;
    }
    
    getNoteName(frequency) {
        const A4 = 440;
        const semitoneRatio = Math.pow(2, 1/12);
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        const semitonesFromA4 = Math.round(12 * Math.log2(frequency / A4));
        const octave = Math.floor((semitonesFromA4 + 9) / 12) + 4;
        const noteIndex = ((semitonesFromA4 + 9) % 12 + 12) % 12;
        
        return noteNames[noteIndex] + octave;
    }
    
    calculateRatio(freq1, freq2) {
        const ratio = Math.max(freq1, freq2) / Math.min(freq1, freq2);
        
        // Find simple fraction approximation
        for (let denom = 1; denom <= 16; denom++) {
            for (let num = denom; num <= denom * 8; num++) {
                const testRatio = num / denom;
                if (Math.abs(testRatio - ratio) / ratio < 0.01) {
                    const cents = 1200 * Math.log2(ratio / testRatio);
                    return {
                        numerator: num,
                        denominator: denom,
                        cents: Math.round(cents)
                    };
                }
            }
        }
        
        return {
            numerator: Math.round(ratio * 100),
            denominator: 100,
            cents: 0
        };
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.hovering = true;
        
        const spiralResult = this.findClosestSpiralPoint(this.mouseX, this.mouseY);
        if (spiralResult) {
            document.getElementById('freq-value').textContent = spiralResult.freq.toFixed(1) + ' Hz';
            document.getElementById('note-value').textContent = this.getNoteName(spiralResult.freq);
            this.hoverFreq = spiralResult.freq;
            this.hoverPoint = spiralResult.point;
        } else {
            document.getElementById('freq-value').textContent = '--';
            document.getElementById('note-value').textContent = '--';
            this.hoverFreq = null;
            this.hoverPoint = null;
        }
        
        this.draw();
    }
    
    handleMouseLeave() {
        this.hovering = false;
        this.hoverFreq = null;
        this.hoverPoint = null;
        document.getElementById('freq-value').textContent = '--';
        document.getElementById('note-value').textContent = '--';
        this.draw();
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const spiralResult = this.findClosestSpiralPoint(x, y);
        if (spiralResult) {
            const freq = spiralResult.freq;
            if (this.pinnedPoints.has(freq)) {
                this.unpinPoint(freq);
            } else {
                this.pinPoint(freq);
            }
        }
    }
    
    pinPoint(freq) {
        const spiralPoint = this.frequencyToSpiral(freq);
        const point = {
            id: Date.now(),
            x: spiralPoint.x,
            y: spiralPoint.y,
            oscillator: null,
            gain: null,
            muted: false
        };
        
        this.pinnedPoints.set(freq, point);
        
        // Start audio if enabled
        if (this.audioEnabled && !point.muted) {
            this.startOscillator(freq, point);
        }
        
        // Auto-enable audio on first point
        if (this.pinnedPoints.size === 1 && !this.audioEnabled) {
            this.toggleAudio();
        }
        
        this.updateArcs();
        this.updatePointsList();
        this.draw();
    }
    
    unpinPoint(freq) {
        const point = this.pinnedPoints.get(freq);
        if (point) {
            this.stopOscillator(point);
            this.pinnedPoints.delete(freq);
            this.updateArcs();
            this.updatePointsList();
            this.draw();
        }
    }
    
    clearAllPoints() {
        this.pinnedPoints.forEach(point => {
            this.stopOscillator(point);
        });
        this.pinnedPoints.clear();
        this.arcsData = [];
        this.arcIndex = 0;
        this.updatePointsList();
        this.draw();
    }
    
    updateArcs() {
        this.arcsData = [];
        this.arcIndex = 0;
        
        const frequencies = Array.from(this.pinnedPoints.keys()).sort((a, b) => a - b);
        
        for (let i = 0; i < frequencies.length; i++) {
            for (let j = i + 1; j < frequencies.length; j++) {
                const freq1 = frequencies[i];
                const freq2 = frequencies[j];
                const point1 = this.pinnedPoints.get(freq1);
                const point2 = this.pinnedPoints.get(freq2);
                
                const spiral1 = this.frequencyToSpiral(freq1);
                const spiral2 = this.frequencyToSpiral(freq2);
                
                const angleDiff = spiral2.angle - spiral1.angle;
                const shortestAngleDiff = angleDiff > Math.PI ? angleDiff - 2 * Math.PI : 
                                         angleDiff < -Math.PI ? angleDiff + 2 * Math.PI : angleDiff;
                
                // Increased spacing for better visibility with more space
                const arcRadius = this.maxRadius + this.spiralWidth + this.baseOffset + (this.arcIndex * 20);
                
                const ratio = this.calculateRatio(freq1, freq2);
                
                this.arcsData.push({
                    point1: point1,
                    point2: point2,
                    freq1: freq1,
                    freq2: freq2,
                    ratio: ratio,
                    arcRadius: arcRadius,
                    startAngle: spiral1.angle,
                    endAngle: spiral2.angle,
                    shortestAngleDiff: shortestAngleDiff,
                    distance: arcRadius
                });
                
                this.arcIndex++;
            }
        }
    }
    
    updatePointsList() {
        const pointsList = document.getElementById('points-list');
        const pointCount = document.getElementById('point-count');
        
        pointCount.textContent = this.pinnedPoints.size;
        
        if (this.pinnedPoints.size === 0) {
            pointsList.innerHTML = `
                <div class="text-muted small text-center py-3">
                    Click on the spiral to pin frequency points
                </div>
            `;
            return;
        }
        
        const frequencies = Array.from(this.pinnedPoints.keys()).sort((a, b) => a - b);
        
        pointsList.innerHTML = frequencies.map(freq => {
            const point = this.pinnedPoints.get(freq);
            const note = this.getNoteName(freq);
            
            return `
                <div class="point-row ${point.muted ? 'muted' : ''}" data-freq="${freq}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1">
                            <input type="number" class="freq-input" value="${freq.toFixed(1)}" 
                                   min="${this.startFreq}" max="${this.endFreq}" step="0.1">
                            <div class="small text-muted">${note}</div>
                        </div>
                        <div class="d-flex gap-1">
                            <button class="btn btn-outline-warning control-btn toggle-mute" title="${point.muted ? 'Unmute' : 'Mute'}">
                                <i class="bi ${point.muted ? 'bi-volume-mute' : 'bi-volume-up'}"></i>
                            </button>
                            <button class="btn btn-outline-danger control-btn remove-point" title="Remove Point">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for controls
        pointsList.querySelectorAll('.freq-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const oldFreq = parseFloat(e.target.closest('.point-row').dataset.freq);
                const newFreq = parseFloat(e.target.value);
                this.updatePointFrequency(oldFreq, newFreq);
            });
        });
        
        pointsList.querySelectorAll('.toggle-mute').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const freq = parseFloat(e.target.closest('.point-row').dataset.freq);
                this.togglePointMute(freq);
            });
        });
        
        pointsList.querySelectorAll('.remove-point').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const freq = parseFloat(e.target.closest('.point-row').dataset.freq);
                this.unpinPoint(freq);
            });
        });
    }
    
    updatePointFrequency(oldFreq, newFreq) {
        if (newFreq < this.startFreq || newFreq > this.endFreq) return;
        
        const point = this.pinnedPoints.get(oldFreq);
        if (point) {
            this.pinnedPoints.delete(oldFreq);
            
            // Update position
            const spiralPoint = this.frequencyToSpiral(newFreq);
            point.x = spiralPoint.x;
            point.y = spiralPoint.y;
            
            // Update audio
            if (point.oscillator) {
                point.oscillator.frequency.value = newFreq;
            }
            
            this.pinnedPoints.set(newFreq, point);
            this.updateArcs();
            this.updatePointsList();
            this.draw();
        }
    }
    
    togglePointMute(freq) {
        const point = this.pinnedPoints.get(freq);
        if (point) {
            point.muted = !point.muted;
            
            if (point.muted) {
                this.stopOscillator(point);
            } else if (this.audioEnabled) {
                this.startOscillator(freq, point);
            }
            
            this.updatePointsList();
            this.draw();
        }
    }
    
    setupTuningSystemsPanel() {
        // Toggle panel visibility
        document.getElementById('toggle-tuning-panel').addEventListener('click', () => {
            const panel = document.getElementById('tuning-panel');
            panel.classList.toggle('collapsed');
        });
        
        // Handle tuning system toggles
        document.querySelectorAll('.tuning-option input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const systemId = e.target.id;
                if (e.target.checked) {
                    this.activeTuningSystems.add(systemId);
                } else {
                    this.activeTuningSystems.delete(systemId);
                }
                this.draw();
            });
        });
        
        // Handle collapse buttons
        document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const icon = e.target.querySelector('i');
                if (icon) {
                    setTimeout(() => {
                        const target = document.querySelector(e.target.dataset.bsTarget);
                        if (target.classList.contains('show')) {
                            icon.className = 'bi bi-chevron-down';
                        } else {
                            icon.className = 'bi bi-chevron-right';
                        }
                    }, 100);
                }
            });
        });
    }
    
    setupArpeggiator() {
        // Initialize the sequencer
        this.arpSequencer = new ArpSequencer();
        
        // Setup piano roll canvas
        this.setupPianoRoll();
        
        // Info button clicks - only if buttons exist
        const tuningInfoBtns = document.querySelectorAll('.tuning-info-btn');
        if (tuningInfoBtns.length > 0) {
            tuningInfoBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const systemId = e.target.closest('.tuning-info-btn').dataset.system;
                    this.showArpeggiator(systemId);
                });
            });
        }
        
        // Sequence selection
        const arpSequence = document.getElementById('arp-sequence');
        if (arpSequence) {
            arpSequence.addEventListener('change', (e) => {
                this.loadSequence(e.target.value);
            });
        }
        
        // Arpeggiator controls - only if elements exist
        const arpPlay = document.getElementById('arp-play');
        if (arpPlay) {
            arpPlay.addEventListener('click', () => {
                this.startArpeggio();
            });
        }
        
        const arpStop = document.getElementById('arp-stop');
        if (arpStop) {
            arpStop.addEventListener('click', () => {
                this.stopArpeggio();
            });
        }
        
        const arpClose = document.getElementById('arp-close');
        if (arpClose) {
            arpClose.addEventListener('click', () => {
                this.hideArpeggiator();
            });
        }
        
        // Tempo slider - only if exists
        const arpTempo = document.getElementById('arp-tempo');
        if (arpTempo) {
            arpTempo.addEventListener('input', (e) => {
                const tempo = parseInt(e.target.value);
                const display = document.getElementById('arp-tempo-display');
                if (display) {
                    display.textContent = tempo + ' BPM';
                }
            });
        }
        
        // Instrument selector - only if exists
        const arpInstrument = document.getElementById('arp-instrument');
        if (arpInstrument) {
            arpInstrument.addEventListener('change', (e) => {
                this.arpInstrument = e.target.value;
            });
        }
        
        // View toggle (piano roll vs notes grid)
        const spiralModeToggle = document.getElementById('spiral-mode-toggle');
        if (spiralModeToggle) {
            spiralModeToggle.addEventListener('click', () => {
                this.toggleSpiralSequenceMode();
            });
        }
    }
    
    showArpeggiator(systemId) {
        console.log('Arpeggiator selected for system:', systemId);
        
        this.selectedTuningSystem = systemId;
        const system = this.tuningSystemsData[systemId];
        
        // Update panel header if element exists
        const systemNameEl = document.getElementById('arp-system-name');
        if (systemNameEl) {
            systemNameEl.textContent = system.name;
        }
        
        // Populate sequence selector
        this.populateSequenceSelector(systemId);
        
        // Load default sequence
        const defaultSequence = this.arpSequencer.getDefaultSequence(systemId);
        if (defaultSequence) {
            this.loadSequence(0); // Load first sequence
        }
        // Always show piano roll (will be empty if no sequence)
        
        // Show panel if it exists
        const panel = document.getElementById('arpeggiator-panel');
        if (panel) {
            panel.classList.add('show');
            this.arpeggiatorVisible = true;
            
            // Re-setup piano roll canvas now that panel is visible
            setTimeout(() => {
                this.setupPianoRoll();
                if (this.currentSequence) {
                    this.renderPianoRoll();
                }
                // Recalculate canvas size after panel is shown
                this.setupCanvas();
                this.draw();
            }, 50); // Small delay to ensure panel is fully rendered
            
            // Update visual state
            document.querySelectorAll('.tuning-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            const selectedOption = document.querySelector(`[data-system="${systemId}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
            
            // Enable controls if they exist
            const playBtn = document.getElementById('arp-play');
            if (playBtn) {
                playBtn.disabled = false;
            }
            
            // Initialize spiral mode toggle button state
            const spiralToggle = document.getElementById('spiral-mode-toggle');
            if (spiralToggle) {
                if (this.spiralSequenceMode) {
                    spiralToggle.innerHTML = '<i class="bi bi-music-note-beamed"></i> Hide from Spiral';
                    spiralToggle.classList.add('active');
                } else {
                    spiralToggle.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Show on Spiral';
                    spiralToggle.classList.remove('active');
                }
            }
        }
    }
    
    hideArpeggiator() {
        this.stopArpeggio();
        
        const panel = document.getElementById('arpeggiator-panel');
        if (panel) {
            panel.classList.remove('show');
        }
        
        this.arpeggiatorVisible = false;
        this.selectedTuningSystem = null;
        this.spiralSequenceMode = false; // Reset mapping mode
        
        // Reset spiral mode toggle button
        const spiralToggle = document.getElementById('spiral-mode-toggle');
        if (spiralToggle) {
            spiralToggle.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Show on Spiral';
            spiralToggle.classList.remove('active');
        }
        
        // Disable map controls
        const mapBtn = document.getElementById('arp-map-toggle');
        const mapDropdown = document.getElementById('arp-map-system');
        if (mapBtn) {
            mapBtn.disabled = true;
            mapBtn.classList.remove('active');
            mapBtn.innerHTML = '<i class="bi bi-arrow-left-right"></i> Map';
        }
        if (mapDropdown) {
            mapDropdown.disabled = true;
            mapDropdown.value = '';
        }
        
        // Clear selected state
        document.querySelectorAll('.tuning-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Recalculate canvas size after panel is hidden and redraw spiral
        setTimeout(() => {
            this.setupCanvas();
            this.draw();
        }, 50); // Small delay to ensure panel hide transition is complete
    }
    
    toggleSpiralSequenceMode() {
        this.spiralSequenceMode = !this.spiralSequenceMode;
        
        const spiralToggle = document.getElementById('spiral-mode-toggle');
        if (spiralToggle) {
            if (this.spiralSequenceMode) {
                spiralToggle.innerHTML = '<i class="bi bi-music-note-beamed"></i> Hide from Spiral';
                spiralToggle.classList.add('active');
            } else {
                spiralToggle.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Show on Spiral';
                spiralToggle.classList.remove('active');
            }
        }
        
        // Redraw spiral to show/hide sequence notes
        this.draw();
    }    
    startSequencePlayback() {
        this.arpPlaying = true;
        this.currentSequenceIndex = 0;
        
        // Get tempo from slider or sequence default
        const tempoEl = document.getElementById('arp-tempo');
        const tempo = tempoEl ? parseInt(tempoEl.value) : this.currentSequence.tempo || 120;
        
        console.log(`Starting sequence: "${this.currentSequence.name}" at ${tempo} BPM`);
        
        // Update UI
        const playBtn = document.getElementById('arp-play');
        const stopBtn = document.getElementById('arp-stop');
        if (playBtn) playBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        
        this.playNextSequenceNote(tempo);
    }
    
    playNextSequenceNote(tempo) {
        if (!this.arpPlaying || !this.currentSequence) return;
        
        if (this.currentSequenceIndex >= this.currentSequence.notes.length) {
            // Sequence finished, loop back to start
            this.currentSequenceIndex = 0;
        }
        
        const note = this.currentSequence.notes[this.currentSequenceIndex];
        const baseFreq = 220; // A3 - correct base for note name calculations
        const frequency = (note.ratio || this.arpSequencer.noteToRatio(note.note)) * baseFreq;
        
        // Calculate note duration in milliseconds
        const beatDuration = 60000 / tempo; // One beat in ms
        const noteDurationMs = note.duration * beatDuration;
        
        // Play the note
        this.playArpNote(frequency, noteDurationMs * 0.9); // Slight gap between notes
        
        // Update visual feedback
        this.highlightSequenceNote(this.currentSequenceIndex);
        this.renderPianoRoll(); // Update playhead
        
        // Redraw spiral if spiral sequence mode is active
        if (this.spiralSequenceMode) {
            this.draw();
        }
        
        // Schedule next note
        this.currentSequenceIndex++;
        this.arpInterval = setTimeout(() => {
            this.playNextSequenceNote(tempo);
        }, noteDurationMs);
    }
    
    highlightSequenceNote(noteIndex) {
        // Clear previous highlights
        document.querySelectorAll('.arp-note.playing').forEach(el => {
            el.classList.remove('playing');
        });
        
        // If we're in notes grid view, highlight the corresponding note
        const noteEl = document.querySelector(`[data-note-id="seq-note-${noteIndex}"]`);
        if (noteEl) {
            noteEl.classList.add('playing');
            setTimeout(() => noteEl.classList.remove('playing'), 150);
        }
    }    
    stopArpeggio() {
        if (!this.arpPlaying) return;
        
        this.arpPlaying = false;
        
        if (this.arpInterval) {
            clearInterval(this.arpInterval);
            clearTimeout(this.arpInterval);
            this.arpInterval = null;
        }
        
        console.log('Arpeggio stopped');
        
        // Update UI if elements exist
        const playBtn = document.getElementById('arp-play');
        const stopBtn = document.getElementById('arp-stop');
        if (playBtn) playBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        
        // Clear highlights
        document.querySelectorAll('.arp-note.playing').forEach(el => {
            el.classList.remove('playing');
        });
        
        // Reset sequence position
        this.currentSequenceIndex = 0;
        
        // Re-render piano roll to clear playhead
        if (this.currentSequence) {
            this.renderPianoRoll();
        }
        
        // Redraw spiral if spiral sequence mode is active to clear highlighting
        if (this.spiralSequenceMode) {
            this.draw();
        }
    }
    
    highlightArpNote(noteId) {
        // Clear previous highlights
        document.querySelectorAll('.arp-note.playing').forEach(el => {
            el.classList.remove('playing');
        });
        
        // Highlight current note
        const noteEl = document.querySelector(`[data-note-id="${noteId}"]`);
        if (noteEl) {
            noteEl.classList.add('playing');
            
            // Remove highlight after animation
            setTimeout(() => {
                noteEl.classList.remove('playing');
            }, 150);
        }
    }
    
    playArpNote(frequency, duration = 200) {
        if (!this.audioContext) return;
        
        try {
            // Create a completely independent audio chain for each note
            // This allows multiple notes to play simultaneously without interference
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            // Configure instrument sound
            switch (this.arpInstrument) {
                case 'guitar':
                    this.configureGuitar(oscillator, gainNode, filterNode, frequency);
                    break;
                case 'piano':
                    this.configurePiano(oscillator, gainNode, filterNode, frequency);
                    break;
                case 'bell':
                    this.configureBell(oscillator, gainNode, filterNode, frequency);
                    break;
                default:
                    oscillator.type = 'sine';
                    // Don't set gain here - let the instrument configuration handle it
                    break;
            }
            
            oscillator.frequency.value = frequency;
            
            // Connect audio graph - route through master gain for volume control
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            
            // Connect to master gain if it exists, otherwise directly to destination
            if (this.masterGain) {
                gainNode.connect(this.masterGain);
            } else {
                gainNode.connect(this.audioContext.destination);
            }
            
            // Enhanced envelope for more musical overlap
            const now = this.audioContext.currentTime;
            const endTime = now + duration / 1000;
            
            // Start the oscillator immediately
            oscillator.start(now);
            
            // Schedule the oscillator to stop - this automatically cleans up
            oscillator.stop(endTime);
            
            // The gainNode envelope is already set in the instrument configuration methods
            
        } catch (error) {
            console.error('Arpeggiator audio error:', error);
        }
    }
    
    configureGuitar(oscillator, gainNode, filterNode, frequency) {
        // Guitar-like sound with sawtooth + filtering
        oscillator.type = 'sawtooth';
        
        // Low-pass filter to remove harsh harmonics
        filterNode.type = 'lowpass';
        filterNode.frequency.value = frequency * 3;
        filterNode.Q.value = 2;
        
        // Enhanced envelope for overlapping notes
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.25, now + 0.005); // Quick attack
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);  // Slight decay
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8); // Longer sustain for overlap
    }
    
    configurePiano(oscillator, gainNode, filterNode, frequency) {
        // Piano-like with triangle wave and harmonics
        oscillator.type = 'triangle';
        
        filterNode.type = 'highpass';
        filterNode.frequency.value = frequency * 0.5;
        filterNode.Q.value = 1;
        
        // Piano envelope - quick attack, longer decay for natural overlap
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01);   // Sharp attack
        gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.2); // Decay to sustain
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2); // Long release for overlap
    }
    
    configureBell(oscillator, gainNode, filterNode, frequency) {
        // Bell-like with sine wave and very long decay
        oscillator.type = 'sine';
        
        filterNode.type = 'bandpass';
        filterNode.frequency.value = frequency * 2;
        filterNode.Q.value = 5;
        
        // Bell envelope - very long sustain for natural resonance overlap
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);  // Gentle attack
        gainNode.gain.exponentialRampToValueAtTime(0.1, now + 0.3); // Quick decay
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.5); // Very long release
    }
    
    // New sequence-based methods
    setupPianoRoll() {
        const canvas = document.getElementById('arp-piano-roll-canvas');
        if (!canvas) return;
        
        this.pianoRollCanvas = canvas;
        this.pianoRollCtx = canvas.getContext('2d');
        
        // Setup canvas dimensions
        const container = document.getElementById('arp-piano-roll-canvas-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            // Check if container is visible and has dimensions
            if (rect.width > 0 && rect.height > 0) {
                canvas.width = rect.width * window.devicePixelRatio;
                canvas.height = rect.height * window.devicePixelRatio;
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
                this.pianoRollCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
            } else {
                console.warn('Piano roll container not visible or has zero dimensions');
                return;
            }
        }
        
        // Add click handler for note preview (remove existing first)
        canvas.removeEventListener('click', this.pianoRollClickHandler);
        this.pianoRollClickHandler = (e) => {
            if (!this.currentSequence) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find clicked note and play preview
            const clickedNote = this.findNoteAtPosition(x, y);
            if (clickedNote) {
                const freq = (clickedNote.ratio || 1) * 220; // Convert to Hz - correct base frequency
                this.playArpNote(freq, 500);
            }
        };
        canvas.addEventListener('click', this.pianoRollClickHandler);
    }
    
    populateSequenceSelector(systemId) {
        const selector = document.getElementById('arp-sequence');
        if (!selector) return;
        
        const sequences = this.arpSequencer.getSequencesForSystem(systemId);
        if (!sequences) {
            selector.innerHTML = '<option value="">No sequences available</option>';
            return;
        }
        
        selector.innerHTML = sequences.sequences.map((seq, index) => 
            `<option value="${index}">${seq.name}</option>`
        ).join('');
        
        // Select first sequence by default
        if (sequences.sequences.length > 0) {
            selector.value = "0";
        }
    }
    
    loadSequence(sequenceIndex) {
        if (!this.selectedTuningSystem || sequenceIndex === "") return;
        
        const sequences = this.arpSequencer.getSequencesForSystem(this.selectedTuningSystem);
        if (!sequences || !sequences.sequences[sequenceIndex]) return;
        
        this.currentSequence = sequences.sequences[sequenceIndex];
        this.currentSequenceIndex = 0;
        
        // Update tempo slider to match sequence tempo
        const tempoSlider = document.getElementById('arp-tempo');
        const tempoDisplay = document.getElementById('arp-tempo-display');
        if (tempoSlider && this.currentSequence.tempo) {
            tempoSlider.value = this.currentSequence.tempo;
            if (tempoDisplay) {
                tempoDisplay.textContent = this.currentSequence.tempo + ' BPM';
            }
        }
        
        // Update sequence info
        this.updateSequenceInfo();
        
        // Render piano roll
        this.renderPianoRoll();
    }
    
    updateSequenceInfo() {
        const infoEl = document.getElementById('arp-sequence-info');
        const nameEl = document.getElementById('arp-sequence-name');
        const descEl = document.getElementById('arp-sequence-description');
        
        if (!this.currentSequence) return;
        
        if (nameEl) {
            nameEl.textContent = this.currentSequence.name;
        }
        
        if (descEl) {
            descEl.textContent = `— ${this.currentSequence.description || 'No description'}`;
        }
        
        if (infoEl) {
            const noteCount = this.currentSequence.notes.length;
            const duration = this.currentSequence.notes.reduce((sum, note) => sum + note.duration, 0);
            const timeSignature = this.currentSequence.timeSignature || [4, 4];
            
            infoEl.innerHTML = `
                <span><strong>Notes:</strong> ${noteCount}</span>
                <span><strong>Duration:</strong> ${duration.toFixed(1)} beats</span>
                <span><strong>Time:</strong> ${timeSignature[0]}/${timeSignature[1]}</span>
            `;
        }
    }
    
    showNotesGrid() {
        const pianoRoll = document.getElementById('arp-piano-roll');
        const notesContainer = document.getElementById('arp-notes-container');
        const viewToggle = document.getElementById('arp-view-toggle');
        
        if (pianoRoll) pianoRoll.style.display = 'none';
        if (notesContainer) notesContainer.style.display = 'block';
        if (viewToggle) {
            viewToggle.innerHTML = '<i class="bi bi-piano"></i> Show Piano Roll';
        }
    }
    
    toggleArpView() {
        const pianoRoll = document.getElementById('arp-piano-roll');
        const notesContainer = document.getElementById('arp-notes-container');
        
        if (pianoRoll && pianoRoll.style.display !== 'none') {
            this.showNotesGrid();
            // Generate notes grid from current sequence
            this.generateNotesFromSequence();
        } else {
            // Always show piano roll
            const viewToggle = document.getElementById('arp-view-toggle');
            if (pianoRoll) pianoRoll.style.display = 'block';
            if (notesContainer) notesContainer.style.display = 'none';
            if (viewToggle) {
                viewToggle.innerHTML = '<i class="bi bi-grid"></i> Show Notes Grid';
            }
        }
    }
    
    generateNotesFromSequence() {
        if (!this.currentSequence) return;
        
        // Convert sequence notes to arpeggiator notes format
        this.arpNotes = this.currentSequence.notes.map((note, index) => {
            const freq = (note.ratio || this.arpSequencer.noteToRatio(note.note)) * 220; // correct base frequency
            return {
                id: `seq-note-${index}`,
                freq: freq,
                noteName: note.note || `${(note.ratio || 1).toFixed(3)}`,
                active: true,
                duration: note.duration,
                velocity: note.velocity || 0.8
            };
        });
        
        this.renderArpeggiatorNotes();
    }
    
    renderPianoRoll() {
        if (!this.pianoRollCtx || !this.currentSequence || !this.pianoRollCanvas) return;
        
        const canvas = this.pianoRollCanvas;
        const ctx = this.pianoRollCtx;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        
        // Skip rendering if canvas has no dimensions
        if (width === 0 || height === 0) {
            console.warn('Piano roll canvas has zero dimensions, skipping render');
            return;
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);
        
        // Calculate dimensions
        const totalDuration = this.currentSequence.notes.reduce((sum, note) => sum + note.duration, 0);
        const ratios = this.currentSequence.notes.map(note => 
            note.ratio || this.arpSequencer.noteToRatio(note.note)
        );
        const maxRatio = Math.max(...ratios) * 1.1; // Add padding
        const minRatio = Math.min(...ratios) * 0.9; // Add padding
        
        const margin = 30;
        const rollWidth = width - 2 * margin;
        const rollHeight = height - 2 * margin;
        
        // Draw professional grid
        this.drawProfessionalGrid(ctx, margin, rollWidth, rollHeight, totalDuration, minRatio, maxRatio);
        
        // Draw notes with better styling
        let currentTime = 0;
        this.currentSequence.notes.forEach((note, index) => {
            const ratio = note.ratio || this.arpSequencer.noteToRatio(note.note);
            
            const x = margin + (currentTime / totalDuration) * rollWidth;
            const y = margin + (1 - (Math.log2(ratio / minRatio) / Math.log2(maxRatio / minRatio))) * rollHeight;
            const noteWidth = Math.max(3, (note.duration / totalDuration) * rollWidth - 1);
            const noteHeight = 12;
            
            // Note shadow for depth
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x + 1, y - noteHeight/2 + 1, noteWidth, noteHeight);
            
            // Note background with velocity-based opacity
            const velocity = note.velocity || 0.8;
            const isCurrentNote = this.arpPlaying && this.currentSequenceIndex === index;
            const baseColor = `rgba(23, 162, 184, ${0.6 + velocity * 0.4})`;
            
            ctx.fillStyle = isCurrentNote ? '#ffc107' : baseColor;
            ctx.fillRect(x, y - noteHeight/2, noteWidth, noteHeight);
            
            // Note border
            ctx.strokeStyle = isCurrentNote ? '#e0a800' : '#138496';
            ctx.lineWidth = isCurrentNote ? 2 : 1;
            ctx.strokeRect(x, y - noteHeight/2, noteWidth, noteHeight);
            
            // Note label with better formatting
            if (noteWidth > 25) {
                ctx.fillStyle = isCurrentNote ? '#000' : 'white';
                ctx.font = '9px monospace';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                const label = note.note || `${ratio.toFixed(2)}`;
                ctx.fillText(label, x + 2, y);
            }
            
            currentTime += note.duration;
        });
        
        // Draw playhead with glow effect
        if (this.arpPlaying) {
            const playheadTime = this.getPlayheadTime();
            const playheadX = margin + (playheadTime / totalDuration) * rollWidth;
            
            // Playhead glow
            ctx.shadowColor = '#dc3545';
            ctx.shadowBlur = 5;
            ctx.strokeStyle = '#dc3545';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(playheadX, margin);
            ctx.lineTo(playheadX, height - margin);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    
    drawProfessionalGrid(ctx, margin, width, height, totalDuration, minRatio, maxRatio) {
        const beatsPerBar = this.currentSequence.timeSignature ? this.currentSequence.timeSignature[0] : 4;
        
        // Vertical grid lines (time)
        ctx.lineWidth = 1;
        
        // Sub-beats (16th notes)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let beat = 0; beat <= totalDuration; beat += 0.25) {
            const x = margin + (beat / totalDuration) * width;
            ctx.beginPath();
            ctx.moveTo(x, margin);
            ctx.lineTo(x, margin + height);
            ctx.stroke();
        }
        
        // Beats
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        for (let beat = 0; beat <= totalDuration; beat += 1) {
            const x = margin + (beat / totalDuration) * width;
            ctx.beginPath();
            ctx.moveTo(x, margin);
            ctx.lineTo(x, margin + height);
            ctx.stroke();
        }
        
        // Bars
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        for (let bar = 0; bar <= totalDuration; bar += beatsPerBar) {
            const x = margin + (bar / totalDuration) * width;
            ctx.beginPath();
            ctx.moveTo(x, margin);
            ctx.lineTo(x, margin + height);
            ctx.stroke();
        }
        
        // Horizontal grid lines (pitch)
        const octaveRange = Math.log2(maxRatio / minRatio);
        const octaves = Math.ceil(octaveRange);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        for (let octave = 0; octave <= octaves; octave++) {
            const ratio = minRatio * Math.pow(2, octave);
            if (ratio <= maxRatio) {
                const y = margin + (1 - (Math.log2(ratio / minRatio) / Math.log2(maxRatio / minRatio))) * height;
                ctx.beginPath();
                ctx.moveTo(margin, y);
                ctx.lineTo(margin + width, y);
                ctx.stroke();
                
                // Octave labels
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '10px monospace';
                ctx.textAlign = 'right';
                ctx.fillText(`${ratio.toFixed(1)}`, margin - 5, y + 3);
            }
        }
    }
    

    
    getPlayheadTime() {
        if (!this.currentSequence || this.currentSequenceIndex === 0) return 0;
        
        return this.currentSequence.notes.slice(0, this.currentSequenceIndex)
            .reduce((sum, note) => sum + note.duration, 0);
    }
    
    findNoteAtPosition(x, y) {
        if (!this.currentSequence) return null;
        
        const canvas = this.pianoRollCanvas;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const margin = 20;
        const rollWidth = width - 2 * margin;
        const rollHeight = height - 2 * margin;
        
        const totalDuration = this.currentSequence.notes.reduce((sum, note) => sum + note.duration, 0);
        
        let currentTime = 0;
        for (let i = 0; i < this.currentSequence.notes.length; i++) {
            const note = this.currentSequence.notes[i];
            const noteX = margin + (currentTime / totalDuration) * rollWidth;
            const noteWidth = (note.duration / totalDuration) * rollWidth;
            
            if (x >= noteX && x <= noteX + noteWidth) {
                return note;
            }
            
            currentTime += note.duration;
        }
        
        return null;
    }
    
    // Modified startArpeggio to handle sequences
    startArpeggio() {
        if (this.arpPlaying) return;
        
        // Initialize audio context if needed
        if (!this.audioContext) {
            this.toggleAudio();
        }
        
        if (this.currentSequence) {
            this.startSequencePlayback();
        }
    }
    
    // Tuning system calculations
    calculate12TET() {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const angleData = [];
        
        for (let octave = 0; octave < 4; octave++) {
            for (let semitone = 0; semitone < 12; semitone++) {
                const freq = this.startFreq * Math.pow(2, (octave + semitone/12));
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = Math.floor(Math.log2(freq / 261.63)) + 4;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: noteNames[semitone] + octaveNumber,
                        cents: semitone * 100
                    });
                }
            }
        }
        return angleData;
    }
    
    calculateJustIntonation() {
        const justRatios = [
            {ratio: 1/1, name: 'C', cents: 0},
            {ratio: 16/15, name: 'Db', cents: 112},
            {ratio: 9/8, name: 'D', cents: 204},
            {ratio: 6/5, name: 'Eb', cents: 316},
            {ratio: 5/4, name: 'E', cents: 386},
            {ratio: 4/3, name: 'F', cents: 498},
            {ratio: 45/32, name: 'F#', cents: 590},
            {ratio: 3/2, name: 'G', cents: 702},
            {ratio: 8/5, name: 'Ab', cents: 814},
            {ratio: 5/3, name: 'A', cents: 884},
            {ratio: 9/5, name: 'Bb', cents: 1018},
            {ratio: 15/8, name: 'B', cents: 1088}
        ];
        
        const angleData = [];
        for (let octave = 0; octave < 4; octave++) {
            justRatios.forEach(note => {
                const freq = this.startFreq * Math.pow(2, octave) * note.ratio;
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: note.name + octaveNumber,
                        cents: note.cents + (octave * 1200)
                    });
                }
            });
        }
        return angleData;
    }

    calculateMeantone() {
        const meantoneRatios = [
            {ratio: 1, name: 'C', cents: 0},
            {ratio: 25/24, name: 'Db', cents: 70},
            {ratio: 9/8, name: 'D', cents: 204},
            {ratio: 6/5, name: 'Eb', cents: 316},
            {ratio: 5/4, name: 'E', cents: 386},
            {ratio: 4/3, name: 'F', cents: 498},
            {ratio: 25/18, name: 'F#', cents: 569},
            {ratio: 3/2, name: 'G', cents: 702},
            {ratio: 25/16, name: 'Ab', cents: 773},
            {ratio: 5/3, name: 'A', cents: 884},
            {ratio: 9/5, name: 'Bb', cents: 1018},
            {ratio: 15/8, name: 'B', cents: 1088}
        ];
        
        const angleData = [];
        for (let octave = 0; octave < 4; octave++) {
            meantoneRatios.forEach(note => {
                const freq = this.startFreq * Math.pow(2, octave) * note.ratio;
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: note.name + octaveNumber,
                        cents: note.cents + (octave * 1200)
                    });
                }
            });
        }
        return angleData;
    }

    calculatePythagorean() {
        const pythagoreanRatios = [
            {ratio: 1/1, name: 'C', cents: 0},
            {ratio: 256/243, name: 'Db', cents: 90},
            {ratio: 9/8, name: 'D', cents: 204},
            {ratio: 32/27, name: 'Eb', cents: 294},
            {ratio: 81/64, name: 'E', cents: 408},
            {ratio: 4/3, name: 'F', cents: 498},
            {ratio: 729/512, name: 'F#', cents: 612},
            {ratio: 3/2, name: 'G', cents: 702},
            {ratio: 128/81, name: 'Ab', cents: 792},
            {ratio: 27/16, name: 'A', cents: 906},
            {ratio: 16/9, name: 'Bb', cents: 996},
            {ratio: 243/128, name: 'B', cents: 1110}
        ];
        
        const angleData = [];
        for (let octave = 0; octave < 4; octave++) {
            pythagoreanRatios.forEach(note => {
                const freq = this.startFreq * Math.pow(2, octave) * note.ratio;
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: note.name + octaveNumber,
                        cents: note.cents + (octave * 1200)
                    });
                }
            });
        }
        return angleData;
    }
    
    calculateNTET(divisions) {
        const angleData = [];
        for (let octave = 0; octave < 4; octave++) {
            for (let step = 0; step < divisions; step++) {
                const freq = this.startFreq * Math.pow(2, (octave + step/divisions));
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const stepName = `${step}/${divisions}`;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: stepName + octaveNumber,
                        cents: (step * 1200 / divisions) + (octave * 1200)
                    });
                }
            }
        }
        return angleData;
    }
    
    calculateArabic24Quarter() {
        const angleData = [];
        for (let octave = 0; octave < 4; octave++) {
            for (let quarter = 0; quarter < 24; quarter++) {
                const freq = this.startFreq * Math.pow(2, (octave + quarter/24));
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: `${quarter}/24 ${octaveNumber}`,
                        cents: (quarter * 50) + (octave * 1200)
                    });
                }
            }
        }
        return angleData;
    }
    
    calculateTurkishMakam() {
        const turkishIntervals = [0, 4, 8, 9, 12, 13, 17, 18, 22, 26, 27, 31, 35, 36, 40, 44, 48, 49];
        const angleData = [];
        
        for (let octave = 0; octave < 4; octave++) {
            turkishIntervals.forEach(interval => {
                const freq = this.startFreq * Math.pow(2, (octave + interval/53));
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: `${interval}/53 ${octaveNumber}`,
                        cents: (interval * 1200/53) + (octave * 1200)
                    });
                }
            });
        }
        return angleData;
    }
    
    calculatePersianDastgah() {
        // Persian classical music intervals (corrected for proper frequency spacing)
        // Based on traditional dastgah system with microtonal intervals
        const persianIntervals = [
            {cents: 0, name: 'C'},        // Unison (0 cents)
            {cents: 90, name: 'Dk'},      // Koron (90 cents) - quarter flat
            {cents: 180, name: 'D'},      // Half tone (180 cents)
            {cents: 294, name: 'Es'},     // Segah (294 cents) - neutral second
            {cents: 386, name: 'E'},      // Major second (386 cents)
            {cents: 498, name: 'F'},      // Perfect fourth (498 cents)
            {cents: 612, name: 'Fs'},     // Sori (612 cents) - quarter sharp fourth
            {cents: 702, name: 'G'},      // Perfect fifth (702 cents)
            {cents: 792, name: 'Ak'},     // Koron sixth (792 cents)
            {cents: 884, name: 'A'},      // Major sixth (884 cents)
            {cents: 996, name: 'Bs'},     // Sori seventh (996 cents)
            {cents: 1088, name: 'B'}      // Major seventh (1088 cents)
            // Note: 1200 cents (octave) removed to avoid duplicates with next octave's 0 cents
        ];
        
        const angleData = [];
        for (let octave = 0; octave < 4; octave++) {
            persianIntervals.forEach(interval => {
                const freq = this.startFreq * Math.pow(2, (octave + interval.cents/1200));
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: interval.name + octaveNumber,
                        cents: interval.cents + (octave * 1200)
                    });
                }
            });
        }
        
        // Add the final octave note only for the highest octave
        const finalOctaveFreq = this.startFreq * Math.pow(2, 4); // 4 octaves up
        if (finalOctaveFreq <= this.endFreq) {
            const t = Math.log2(finalOctaveFreq / this.startFreq) / this.spiralTurns;
            const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
            angleData.push({
                angle: angle,
                freq: finalOctaveFreq,
                noteName: 'C7', // Final octave note
                cents: 4800 // 4 octaves * 1200 cents
            });
        }
        
        return angleData;
    }

    calculateCarnatic22Sruti() {
        // Carnatic 22 sruti system with traditional ratios
        // Based on the ancient Indian microtonal system
        const carnaticSrutis = [
            {ratio: 1/1, name: 'Sa', cents: 0},           // Shadja
            {ratio: 256/243, name: 'Re1', cents: 90},     // Suddha Rishabha (komal re)
            {ratio: 16/15, name: 'Re2', cents: 112},      // Chatussruti Rishabha
            {ratio: 10/9, name: 'Re3', cents: 182},       // Shatsruti Rishabha
            {ratio: 9/8, name: 'Re', cents: 204},         // Suddha Rishabha
            {ratio: 32/27, name: 'Ga1', cents: 294},      // Sadharana Gandhara
            {ratio: 6/5, name: 'Ga2', cents: 316},        // Antara Gandhara
            {ratio: 5/4, name: 'Ga', cents: 386},         // Suddha Gandhara
            {ratio: 81/64, name: 'Ga3', cents: 408},      // Suddha Madhyama
            {ratio: 4/3, name: 'Ma', cents: 498},         // Suddha Madhyama
            {ratio: 27/20, name: 'Ma#', cents: 520},      // Prati Madhyama
            {ratio: 45/32, name: 'Ma+', cents: 590},      // Tivra Madhyama
            {ratio: 3/2, name: 'Pa', cents: 702},         // Panchama
            {ratio: 128/81, name: 'Dha1', cents: 792},    // Suddha Dhaivata
            {ratio: 8/5, name: 'Dha2', cents: 814},       // Chatussruti Dhaivata
            {ratio: 5/3, name: 'Dha3', cents: 884},       // Shatsruti Dhaivata
            {ratio: 27/16, name: 'Dha', cents: 906},      // Suddha Dhaivata
            {ratio: 16/9, name: 'Ni1', cents: 996},       // Kaisiki Nishada
            {ratio: 9/5, name: 'Ni2', cents: 1018},       // Kakali Nishada
            {ratio: 15/8, name: 'Ni3', cents: 1088},      // Suddha Nishada
            {ratio: 243/128, name: 'Ni', cents: 1110},    // Kakali Nishada
            {ratio: 2/1, name: 'Sa*', cents: 1200}        // Octave
        ];

        const angleData = [];
        for (let octave = 0; octave < 4; octave++) {
            carnaticSrutis.forEach((sruti, index) => {
                // Skip the octave note except for the final iteration
                if (index === carnaticSrutis.length - 1 && octave < 3) return;
                
                const freq = this.startFreq * Math.pow(2, octave) * sruti.ratio;
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: sruti.name + octaveNumber,
                        cents: sruti.cents + (octave * 1200),
                        ratio: sruti.ratio
                    });
                }
            });
        }
        return angleData;
    }

    calculateHindustani22Sruti() {
        // Hindustani 22 sruti system with thaat-based intervals
        // Similar to Carnatic but with some variations in usage and naming
        const hindustaniSrutis = [
            {ratio: 1/1, name: 'Sa', cents: 0},           // Shadja
            {ratio: 256/243, name: 'ko Re', cents: 90},   // Komal Rishabha
            {ratio: 16/15, name: 'ko Re+', cents: 112},   // Komal Rishabha (higher)
            {ratio: 10/9, name: 'Re-', cents: 182},       // Rishabha (lower)
            {ratio: 9/8, name: 'Re', cents: 204},         // Suddha Rishabha
            {ratio: 32/27, name: 'ko Ga', cents: 294},    // Komal Gandhara
            {ratio: 6/5, name: 'ko Ga+', cents: 316},     // Komal Gandhara (higher)
            {ratio: 5/4, name: 'Ga', cents: 386},         // Suddha Gandhara
            {ratio: 81/64, name: 'Ga+', cents: 408},      // Gandhara (higher)
            {ratio: 4/3, name: 'Ma', cents: 498},         // Suddha Madhyama
            {ratio: 27/20, name: 'Ma+', cents: 520},      // Madhyama (higher)
            {ratio: 45/32, name: 'ti Ma', cents: 590},    // Tivra Madhyama
            {ratio: 3/2, name: 'Pa', cents: 702},         // Panchama
            {ratio: 128/81, name: 'ko Dha', cents: 792},  // Komal Dhaivata
            {ratio: 8/5, name: 'ko Dha+', cents: 814},    // Komal Dhaivata (higher)
            {ratio: 5/3, name: 'Dha-', cents: 884},       // Dhaivata (lower)
            {ratio: 27/16, name: 'Dha', cents: 906},      // Suddha Dhaivata
            {ratio: 16/9, name: 'ko Ni', cents: 996},     // Komal Nishada
            {ratio: 9/5, name: 'ko Ni+', cents: 1018},    // Komal Nishada (higher)
            {ratio: 15/8, name: 'Ni-', cents: 1088},      // Nishada (lower)
            {ratio: 243/128, name: 'Ni', cents: 1110},    // Suddha Nishada
            {ratio: 2/1, name: 'Sa*', cents: 1200}        // Octave
        ];

        const angleData = [];
        for (let octave = 0; octave < 4; octave++) {
            hindustaniSrutis.forEach((sruti, index) => {
                // Skip the octave note except for the final iteration
                if (index === hindustaniSrutis.length - 1 && octave < 3) return;
                
                const freq = this.startFreq * Math.pow(2, octave) * sruti.ratio;
                if (freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: sruti.name + octaveNumber,
                        cents: sruti.cents + (octave * 1200),
                        ratio: sruti.ratio
                    });
                }
            });
        }
        return angleData;
    }

    calculateOvertones() {
        const harmonics = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        const angleData = [];
        harmonics.forEach(harmonic => {
            const freq = this.startFreq * harmonic;
            if (freq <= this.endFreq) {
                const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                angleData.push({
                    angle: angle,
                    freq: freq,
                    noteName: `H${harmonic}`,
                    cents: 1200 * Math.log2(harmonic)
                });
            }
        });
        return angleData;
    }
    
    calculateUndertones() {
        const subharmonics = [1, 1/2, 1/3, 1/4, 1/5, 1/6, 1/7, 1/8, 1/9, 1/10, 1/11, 1/12, 1/13, 1/14, 1/15, 1/16];
        const angleData = [];
        for (let octave = 0; octave < 4; octave++) {
            subharmonics.forEach((ratio, index) => {
                const freq = this.startFreq * Math.pow(2, octave) * ratio;
                if (freq >= this.startFreq && freq <= this.endFreq) {
                    const t = Math.log2(freq / this.startFreq) / this.spiralTurns;
                    const angle = -Math.PI/2 + t * this.spiralTurns * 2 * Math.PI;
                    const octaveNumber = 3 + octave;
                    angleData.push({
                        angle: angle,
                        freq: freq,
                        noteName: `U${index + 1} ${octaveNumber}`,
                        cents: 1200 * Math.log2(ratio) + (octave * 1200)
                    });
                }
            });
        }
        return angleData;
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width / window.devicePixelRatio, 
                                 this.canvas.height / window.devicePixelRatio);
        
        this.drawSpiral();
        this.drawTuningSystemLines();
        this.drawArcs();
        this.drawPinnedPoints();
        this.drawHoverLine();
        this.drawCenterPoint();
    }
    
    drawTuningSystemLines() {
        const sortedSystems = Array.from(this.activeTuningSystems)
            .map(id => ({id, ...this.tuningSystemsData[id]}))
            .sort((a, b) => a.offset - b.offset);

        sortedSystems.forEach(system => {
            if (!system) return;
            
            const angleData = system.calculateAngles();
            
            this.ctx.strokeStyle = system.color;
            this.ctx.globalAlpha = system.opacity;
            this.ctx.lineWidth = system.id === '12-tet' ? 2 : 1;
            
            if (system.style === 'dashed') {
                this.ctx.setLineDash([4, 4]);
            } else if (system.style === 'dotted') {
                this.ctx.setLineDash([2, 2]);
            } else {
                this.ctx.setLineDash([]);
            }
            
            angleData.forEach((data, index) => {
                const angle = data.angle;
                const startRadius = 5;
                const endRadius = this.maxRadius + this.spiralWidth + this.baseOffset + 200 + system.offset;
                
                const startX = this.centerX + startRadius * Math.cos(angle);
                const startY = this.centerY + startRadius * Math.sin(angle);
                const endX = this.centerX + endRadius * Math.cos(angle);
                const endY = this.centerY + endRadius * Math.sin(angle);
                
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
                
                const shouldShowLabel = this.shouldShowTuningLabel(data, system.id, index);
                if (shouldShowLabel) {
                    this.drawTuningLabel(data, endX, endY, system.color);
                }
            });
            
            this.ctx.setLineDash([]);
            this.ctx.globalAlpha = 1.0;
        });
    }
    
    shouldShowTuningLabel(data, systemId, index) {
        if (systemId === '12-tet') {
            return data.noteName && data.noteName.includes('C');
        } else if (systemId === 'just' || systemId === 'meantone') {
            return data.noteName && (data.noteName.includes('C') || data.noteName.includes('E') || data.noteName.includes('G'));
        } else {
            return index % 4 === 0;
        }
    }
    
    drawTuningLabel(data, x, y, color) {
        const labelText = data.noteName || '';
        this.ctx.font = '9px sans-serif';
        const textMetrics = this.ctx.measureText(labelText);
        const labelWidth = textMetrics.width + 6;
        const labelHeight = 14;
        
        const labelX = x + 5;
        const labelY = y;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(labelX - labelWidth/2, labelY - labelHeight/2, labelWidth, labelHeight);
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([]);
        this.ctx.strokeRect(labelX - labelWidth/2, labelY - labelHeight/2, labelWidth, labelHeight);
        
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(labelText, labelX, labelY + 3);
    }

    drawSpiral() {
        this.ctx.strokeStyle = '#6c757d';
        this.ctx.lineWidth = this.spiralWidth;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        for (let i = 0; i <= 1000; i++) {
            const t = i / 1000;
            const freq = this.startFreq * Math.pow(2, t * this.spiralTurns);
            const point = this.frequencyToSpiral(freq);
            
            if (i === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        }
        this.ctx.stroke();
        
        // Draw sequence notes on spiral if in spiral sequence mode
        if (this.spiralSequenceMode && this.currentSequence) {
            this.drawSequenceOnSpiral();
        }
        
        this.ctx.fillStyle = '#ffc107';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        
        for (let octave = 0; octave <= 4; octave++) {
            const freq = this.startFreq * Math.pow(2, octave);
            const point = this.frequencyToSpiral(freq);
            const labelY = point.y - 15;
            this.ctx.fillText(freq + 'Hz', point.x, labelY);
        }
    }
    
    drawSequenceOnSpiral() {
        if (!this.currentSequence || !this.currentSequence.notes) return;
        
        // Get unique frequencies from the sequence
        const sequenceFreqs = new Set();
        const baseFreq = 220; // A3 - correct base for note name calculations
        
        this.currentSequence.notes.forEach(note => {
            // Calculate frequency from ratio or note name
            const frequency = (note.ratio || this.arpSequencer.noteToRatio(note.note)) * baseFreq;
            if (frequency && !isNaN(frequency)) {
                sequenceFreqs.add(frequency);
            }
        });
        
        // Draw sequence notes on spiral
        sequenceFreqs.forEach(freq => {
            if (!freq || isNaN(freq)) return; // Skip invalid frequencies
            
            const point = this.frequencyToSpiral(freq);
            
            // Check if this note is currently playing
            const currentNote = this.arpPlaying && this.currentSequenceIndex < this.currentSequence.notes.length ? 
                this.currentSequence.notes[this.currentSequenceIndex] : null;
            const currentFreq = currentNote ? 
                (currentNote.ratio || this.arpSequencer.noteToRatio(currentNote.note)) * baseFreq : null;
            const isPlaying = currentFreq && Math.abs(freq - currentFreq) < 1.0; // Increased tolerance to 1Hz
            
            // Draw note circle
            this.ctx.fillStyle = isPlaying ? '#ff6b6b' : '#28a745';
            this.ctx.shadowColor = isPlaying ? '#ff6b6b' : '#28a745';
            this.ctx.shadowBlur = isPlaying ? 20 : 10;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, isPlaying ? 12 : 8, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Draw frequency label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '10px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(freq.toFixed(1) + 'Hz', point.x, point.y - 20);
        });
    }
    
    drawArcs() {
        this.arcsData.forEach(arc => {
            this.ctx.strokeStyle = '#17a2b8';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, arc.arcRadius, 
                        arc.startAngle, arc.endAngle);
            this.ctx.stroke();
            
            this.ctx.setLineDash([2, 2]);
            this.ctx.lineWidth = 1;
            
            const arcStart1X = this.centerX + arc.arcRadius * Math.cos(arc.startAngle);
            const arcStart1Y = this.centerY + arc.arcRadius * Math.sin(arc.startAngle);
            this.ctx.beginPath();
            this.ctx.moveTo(arc.point1.x, arc.point1.y);
            this.ctx.lineTo(arcStart1X, arcStart1Y);
            this.ctx.stroke();
            
            const arcStart2X = this.centerX + arc.arcRadius * Math.cos(arc.endAngle);
            const arcStart2Y = this.centerY + arc.arcRadius * Math.sin(arc.endAngle);
            this.ctx.beginPath();
            this.ctx.moveTo(arc.point2.x, arc.point2.y);
            this.ctx.lineTo(arcStart2X, arcStart2Y);
            this.ctx.stroke();
            
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.beginPath();
            this.ctx.arc(arcStart1X, arcStart1Y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(arcStart2X, arcStart2Y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
            
            const midAngle = (arc.startAngle + arc.endAngle) / 2;
            const labelX = this.centerX + arc.arcRadius * Math.cos(midAngle);
            const labelY = this.centerY + arc.arcRadius * Math.sin(midAngle);
            
            const ratio = arc.ratio;
            const ratioText = `${ratio.numerator}:${ratio.denominator}`;
            const centsText = `${ratio.cents >= 0 ? '+' : ''}${ratio.cents}¢`;
            
            this.ctx.font = '10px sans-serif';
            const ratioMetrics = this.ctx.measureText(ratioText);
            const centsMetrics = this.ctx.measureText(centsText);
            
            const textSpacing = 6;
            const horizontalPadding = 6;
            const verticalPadding = 4;
            const labelWidth = ratioMetrics.width + textSpacing + centsMetrics.width + (horizontalPadding * 2);
            const labelHeight = 14 + (verticalPadding * 2);
            
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(labelX - labelWidth/2, labelY - labelHeight/2, labelWidth, labelHeight);
            
            this.ctx.strokeStyle = '#17a2b8';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([]);
            this.ctx.strokeRect(labelX - labelWidth/2, labelY - labelHeight/2, labelWidth, labelHeight);
            
            const ratioX = labelX - (centsMetrics.width + textSpacing) / 2;
            const centsX = labelX + (ratioMetrics.width + textSpacing) / 2;
            
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(ratioText, ratioX, labelY + 3);
            
            this.ctx.fillStyle = Math.abs(ratio.cents) <= 2 ? '#28a745' : '#ffc107';
            this.ctx.fillText(centsText, centsX, labelY + 3);
        });
        
        this.ctx.setLineDash([]);
    }
    
    drawPinnedPoints() {
        this.pinnedPoints.forEach((point, freq) => {
            this.ctx.fillStyle = point.muted ? '#495057' : '#dc3545';
            this.ctx.strokeStyle = point.muted ? '#6c757d' : '#fff';
            this.ctx.lineWidth = 3;
            
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        });
    }
    
    drawHoverLine() {
        if (!this.hovering || !this.hoverFreq || !this.hoverPoint) return;
        
        this.ctx.strokeStyle = '#28a745';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        
        const extendedRadius = this.maxRadius + this.spiralWidth + this.baseOffset + 50;
        const angle = this.hoverPoint.angle;
        const endX = this.centerX + extendedRadius * Math.cos(angle);
        const endY = this.centerY + extendedRadius * Math.sin(angle);
        
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        this.ctx.fillStyle = '#28a745';
        this.ctx.beginPath();
        this.ctx.arc(this.hoverPoint.x, this.hoverPoint.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawCenterPoint() {
        this.ctx.fillStyle = '#dc3545';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 5, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
    new Microtuna();
});
# Microtuna - Music Scale Explorer Specification

## Overview
A web-based logarithmic spiral frequency visualizer that allows users to explore harmonic relationships between musical frequencies through an interactive interface. Features include real-time audio synthesis, multiple tuning system overlays, and an intelligent arpeggiator for exploring scales.

## Project Structure
```
microtuna/
├── index.html          # Main HTML structure with Bootstrap 5 dark theme
├── main.css           # Custom styling and animations
├── main.js            # Core JavaScript logic with full audio implementation
├── arps.js            # Musical sequences and arpeggiator logic for all tuning systems
└── spec.md            # This specification document
```

## Core Concept
The application visualizes musical frequencies using two main components:
- **Inner spiral**: A logarithmic spiral representing the continuous frequency spectrum
- **Outer visualization circles**: Fixed-radius concentric circles where harmonic relationship arcs are drawn
- **Tuning system overlays**: Radial lines showing different musical tuning systems
- **Interactive arpeggiator**: Scale-aware sequencer for exploring tuning systems

### Mathematical Foundation

#### Spiral Parameters
- **Start frequency**: 110Hz (A2) - Updated for arpeggiator integration
- **End frequency**: 3520Hz (A7) 
- **Spiral turns**: 4 complete rotations (4 octaves)
- **Frequency mapping**: `f = 110 * 2^(t * 5)` where `t ∈ [0,1]` (5 octaves: 110Hz to 3520Hz)
- **Spiral equation**: 
  - `radius = t * maxRadius`
  - `angle = -π/2 + (t * 5 * 2π)`
- **Zoom control**: User-adjustable zoom slider (0.5x to 2.0x) for detailed exploration

#### Outer Visualization Circles
- **Purpose**: ALL harmonic arcs are drawn on concentric circles outside the spiral
- **Base radius**: Calculated to be outside the spiral area with appropriate spacing
- **Multiple arcs**: Concentric circles with consistent spacing for overlapping intervals
- **Arc type**: Simple circular arcs using standard canvas arc methods
- **Arc indexing**: Each arc pair gets a unique index to ensure proper spacing

#### Tuning System Radial Lines
- **Purpose**: Show different musical tuning systems as radial overlays
- **Calculation**: Each system calculates its own set of angle positions
- **Rendering**: Lines extend from center to outer edge beyond arc area
- **Simultaneous display**: Multiple systems can be active simultaneously

## Technical Requirements

### Canvas Setup
- **Coordinate system**: Center-based with proper device pixel ratio scaling
- **Responsive**: Auto-resize with window changes
- **Size calculation**: Dynamic sizing based on viewport with appropriate margins for UI elements

### Spiral Rendering
- **Steps**: High resolution discrete points for smooth curves
- **Color**: Medium gray appearance
- **Width**: Moderate line width with round line caps
- **Octave markers**: Prominent frequency labels at key octave points

### Tuning System Implementation

#### Available Systems
**Western Systems:**
- **12-TET (Equal)**: White, solid lines, high opacity
- **Just Intonation**: Green, dashed lines, medium opacity
- **Pythagorean**: Yellow, dashed lines, medium opacity
- **Meantone**: Orange, dashed lines, moderate opacity

**Microtonal Systems:**
- **19-TET**: Purple, dotted lines, moderate opacity
- **31-TET**: Pink, dotted lines, moderate opacity
- **53-TET**: Teal, dotted lines, moderate opacity

**Harmonic Series:**
- **Overtones**: Cyan, solid lines, medium opacity
- **Undertones**: Gray, solid lines, moderate opacity

**World Music Systems:**
- **Arabic 24-Quarter**: Magenta, solid lines, medium opacity
- **Turkish Makam**: Red, dashed lines, medium opacity
- **Persian Dastgah**: Orange, dashed lines, moderate opacity

#### Rendering Algorithm
1. **Calculate angles**: Each system generates its frequency/angle pairs
2. **Sort by visual hierarchy**: Render systems in appropriate layering order
3. **Draw radial lines**: From center extending to appropriate outer boundaries
4. **Apply styling**: Line dash patterns, colors, and opacity per system
5. **Add labels**: Selective labeling based on system type and note importance

### Arc Rendering Algorithm
1. **Get spiral angles**: Use identical calculation for both frequencies
2. **Find shortest path**: Handle multi-octave intervals correctly
3. **Draw on outer circles**: Use fixed radius with appropriate spacing to prevent overlap
4. **Add connectors**: Radial lines from pinned points to arc endpoints
5. **Label**: Display frequency ratio and cents deviation with intelligent positioning

### Audio Implementation (Polyphonic)

#### Web Audio Architecture
- **Context**: Single AudioContext for all audio
- **Polyphonic design**: Independent audio chains for each sound
- **Master gain**: Global volume control with arpeggiator integration
- **Instrument simulation**: Realistic ADSR envelopes and filtering

#### Pinned Points Audio
- **Individual oscillators**: Each point has dedicated oscillator + gain + filter
- **Real-time control**: Frequency, mute, wave type changes
- **Persistent audio**: Continuous playback until muted or removed

#### Arpeggiator Audio System
- **Independent chains**: Each arpeggio note creates separate audio nodes
- **Overlapping notes**: Natural decay allows multiple notes to ring simultaneously
- **Instrument models**:
  - **Guitar**: Sawtooth wave, low-pass filter, quick attack, sustained decay
  - **Piano**: Triangle wave, high-pass filter, sharp attack, exponential decay
  - **Bell**: Sine wave, band-pass filter, gentle attack, very long resonance
- **Duration scaling**: Instrument-specific overlap ratios (1.8x-4.0x note duration)

## User Interface Specification

### Layout (Bootstrap 5 Dark Theme)
- **Header**: Navigation bar with brand logo and global audio controls
- **Main area**: Horizontal split layout with collapsible panels
  - **Left**: Canvas container (flexible width, minimum space for spiral)
  - **Center-Right**: Pinned points panel (fixed moderate width)
  - **Far-Right**: Tuning systems panel (fixed moderate width, collapsible)
- **Overlays**: 
  - Frequency display card (positioned in corner)
  - Arpeggiator modal panel (overlay design)

### Visual Elements

#### Spiral
- **Color**: Medium gray appearance
- **Width**: Moderate line width for clear visibility
- **Style**: Round line caps
- **Center point**: Small colored circle marking center
- **Octave labels**: Colored text showing key frequencies
- **Hover feedback**: Contrasting dashed radial line with frequency display

#### Tuning System Lines
- **Visual hierarchy**: Sorted by visual importance for proper layering
- **Line styles**: Solid, dashed, or dotted based on system type
- **Color coding**: Distinct colors for each system family
- **Opacity control**: Semi-transparent to avoid overwhelming spiral
- **Length**: Extend beyond arc area for clear system comparison
- **Labels**: Selective note names based on system importance

#### Pinned Points
- **Active state**: Prominent color, moderate radius, contrasting stroke
- **Muted state**: Muted color, smaller radius, subdued stroke
- **Behavior**: Snap to exact spiral centerline on click
- **Audio feedback**: Immediate oscillator start with current wave type

#### Harmonic Arcs
- **Location**: Outer visualization circles only
- **Style**: Dashed lines in distinctive color, moderate width
- **Spacing**: Consistent increments to prevent visual overlap
- **Connectors**: Dotted radial lines from points to arc endpoints
- **Endpoints**: Small colored circles marking arc boundaries
- **Labels**: 
  - Ratio format: "3:2", "4:3", etc.
  - Cents deviation: "+15¢", "-8¢"
  - Color coding: Different colors based on harmonic accuracy
  - Background: Semi-transparent container with border

### Control Panels

#### Header Controls
- **Audio Toggle**: Start/Stop button with visual state indication
- **Wave Type**: Dropdown with common waveform options
- **Volume**: Slider with percentage display
- **Clear All**: Prominent button to remove all pinned points

#### Pinned Points Panel
- **Header**: Shows current point count
- **Point list**: Sortable by frequency
- **Per-point controls**:
  - Frequency input: Editable field with real-time updates
  - Note display: Calculated note name and octave
  - Mute toggle: Button with visual state indication
  - Remove: Deletion button

#### Tuning Systems Panel
- **Collapsible**: Toggle button to hide/show panel
- **Grouped sections**: 
  - Western Systems (collapsible)
  - Microtonal Systems (collapsible)  
  - World Music Systems (collapsible)
- **Individual toggles**: Checkbox for each system
- **Info buttons**: Access to arpeggiator for each system (💿 icon)
- **Visual feedback**: Selected system highlights when arpeggiator active

### Arpeggiator Interface

#### Panel Design
- **Bottom overlay panel**: Slides up from bottom of screen, consistent with dark theme
- **Ultra-compact header**: Single horizontal line containing all information
  - Left side: Sequence identification and cultural description
  - Right side: Notes/Duration/Time statistics and spiral toggle button
- **Professional piano roll**: Fixed height canvas with real-time visualization
- **Minimal padding**: Optimized spacing for maximum compactness
- **Responsive height**: Panel adjusts to content efficiently

#### Header Layout Optimization
The header should contain all essential information in a single horizontal line with appropriate spacing between elements. Left side contains sequence identification, right side contains statistics and controls.

#### CSS Optimizations
- **Minimal padding**: Piano roll components optimized for space efficiency
- **No excessive margins**: Compact design throughout
- **Fixed dimensions**: Canvas container with appropriate height
- **Professional styling**: Rounded borders with dark background for professional appearance

#### Controls
- **Selection controls**:
  - Select All: Button to enable all notes
  - Unselect All: Button to disable all notes
  - Individual toggle: Click any note to enable/disable
- **Playback controls**:
  - Play: Start arpeggio with current settings
  - Stop: Halt arpeggio and clear highlights
  - Tempo: Slider with appropriate range and live display
  - Style: Dropdown with arpeggio pattern options
  - Instrument: Dropdown with instrument simulation options

#### Note Generation
- **Frequency range**: Middle octave range for optimal listening
- **System-specific**: Each tuning system generates its unique set of pitches
- **Deduplication**: No frequency overlaps within systems
- **Smart preview**: Single note preview on selection, chord preview on group selection

## Interaction Behaviors

### Mouse Events
1. **Hover spiral**: 
   - Contrasting dashed radial line from center through mouse position
   - Real-time frequency and note name display
   - Smooth tracking with high frame rate performance

2. **Click spiral**:
   - Pin new point with immediate audio start
   - Unpin existing point and stop its audio
   - Auto-enable audio system on first point
   - Update harmonic arc calculations

3. **Panel interactions**:
   - Toggle tuning systems with immediate visual update
   - Edit point frequencies with real-time audio changes
   - Mute/unmute points with immediate audio response

### Audio Behaviors
- **Polyphonic design**: Multiple simultaneous sounds without interference
- **Real-time updates**: All parameter changes affect audio immediately
- **Graceful handling**: Audio permissions, context suspension, error recovery
- **Performance**: Efficient oscillator management and cleanup

### Arpeggiator Behaviors
- **Intelligent overlap**: Notes ring naturally based on instrument characteristics
- **Visual feedback**: Current note highlighting with smooth transitions
- **Tempo sync**: Precise timing with Web Audio scheduled events
- **Pattern variety**: Multiple arpeggio styles with proper direction handling

## JavaScript Architecture

### Arpeggiator Class Structure
```javascript
class ArpSequencer {
  constructor() {
    this.selectedTuningSystem = null;
    this.arpeggiatorVisible = false;
    this.currentSequence = null;
    this.arpPlaying = false;
    this.arpPosition = 0;
    this.arpDirection = 1;
    this.arpInterval = null;
    this.arpInstrument = 'guitar';
  }
  
  // Core Methods (Simplified)
  showArpeggiator(tuningSystem) {
    // Always show piano roll (no conditional logic)
    // Load sequence and render immediately
  }
  
  loadSequence(sequenceKey) {
    // Update sequence info display
    // Render piano roll
    // No separate show/hide functions needed
  }
  
  // Removed Functions (for simplification)
  // - showDefaultMessage() - eliminated default message entirely
  // - showPianoRoll() - always visible, no toggle needed
  // - All mapping-related functions - removed for clean UX
}
```

### Simplified Event Handling
- **Direct piano roll display**: No conditional show/hide logic
- **Streamlined sequence loading**: Immediate rendering without state checks  
- **Removed complexity**: Mapping functionality removed for clean user experience
- **Optimized rendering**: Single code path for all arpeggiator operations

### Pinned Points Map
```javascript
Map<frequency, {
  id: number,           // Unique timestamp ID
  x: number,           // Canvas X coordinate
  y: number,           // Canvas Y coordinate
  oscillator: OscillatorNode | null,
  gain: GainNode | null,
  muted: boolean       // Individual mute state
}>
```

### Arc Data Array
```javascript
[{
  point1: PointObject,     // First pinned point
  point2: PointObject,     // Second pinned point
  freq1: number,           // Lower frequency
  freq2: number,           // Higher frequency
  ratio: {                 // Calculated harmonic ratio
    numerator: number,
    denominator: number,
    cents: number          // Deviation from perfect ratio
  },
  arcRadius: number,       // Outer circle radius for this arc
  startAngle: number,      // Spiral angle of freq1
  endAngle: number,        // Spiral angle of freq2
  shortestAngleDiff: number, // Angular distance (handles wrap-around)
  distance: number         // For click detection
}]
```

### Tuning Systems Data
```javascript
{
  systemId: {
    name: string,            // Display name
    color: string,           // CSS color
    style: string,           // 'solid', 'dashed', 'dotted'
    opacity: number,         // 0.0-1.0
    offset: number,          // Line extension distance (px)
    calculateAngles: function // Returns array of {angle, freq, noteName, cents}
  }
}
```

### Arpeggiator State
```javascript
{
  selectedTuningSystem: string | null,
  arpeggiatorVisible: boolean,
  arpNotes: [{              // Generated notes for current system
    angle: number,
    freq: number,
    noteName: string,
    cents: number,
    id: string,             // Unique identifier
    active: boolean         // User selection state
  }],
  arpPlaying: boolean,
  arpPosition: number,      // Current note index
  arpDirection: number,     // 1 for up, -1 for down
  arpInterval: number | null, // setInterval reference
  arpInstrument: string     // 'guitar', 'piano', 'bell'
}
```

## Mathematical Implementations

### Frequency to Spiral Conversion
```javascript
function frequencyToSpiral(freq) {
  const t = Math.log2(freq / 220) / 4;
  const radius = t * maxRadius;
  const angle = -Math.PI/2 + (t * 4 * 2 * Math.PI);
  return { x: centerX + radius * Math.cos(angle), 
           y: centerY + radius * Math.sin(angle), 
           radius, angle, t };
}
```

### Tuning System Calculations

#### 12-TET (Equal Temperament)
```javascript
calculate12TET() {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  for (let octave = 0; octave < 4; octave++) {
    for (let semitone = 0; semitone < 12; semitone++) {
      const freq = 220 * Math.pow(2, (octave + semitone/12));
      // Convert to angle and add to results
    }
  }
}
```

#### Just Intonation
```javascript
calculateJustIntonation() {
  const justRatios = [
    {ratio: 1/1, name: 'C', cents: 0},
    {ratio: 16/15, name: 'Db', cents: 112},
    {ratio: 9/8, name: 'D', cents: 204},
    // ... complete set of just intervals
  ];
  // Apply ratios across octaves
}
```

#### Harmonic Series (Overtones)
```javascript
calculateOvertones() {
  const harmonics = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  harmonics.forEach(harmonic => {
    const freq = 220 * harmonic;
    if (freq <= 3520) {
      // Convert to angle and add to results
    }
  });
}
```

### Harmonic Analysis
- **Ratio detection**: Find simple fractions within 1% tolerance
- **Search range**: Denominators 1-16, numerators up to 8x denominator
- **Cents calculation**: `1200 * log2(actualRatio / perfectRatio)`
- **Display threshold**: Show deviation if >2¢

## Performance Considerations

### Canvas Optimization
- **Device pixel ratio**: Proper scaling for high-DPI displays
- **Efficient redraw**: Full canvas clear and redraw on state changes
- **Optimized spiral width**: Moderate width for clear visibility without overwhelming
- **Smart hover detection**: Optimized spiral point sampling for responsiveness

### Audio Performance
- **Context sharing**: Single AudioContext for all audio
- **Independent chains**: Polyphonic design prevents audio interference
- **Automatic cleanup**: Scheduled oscillator disposal
- **Error handling**: Graceful degradation for audio failures

### Memory Management
- **Oscillator lifecycle**: Create on demand, dispose automatically
- **Event listener cleanup**: Proper removal on panel state changes
- **Efficient data structures**: Maps for O(1) point lookups

## Advanced Features

### Enhanced Arpeggiator System

#### Ultra-Compact Panel Implementation
- **Bottom panel**: Fixed position at bottom of viewport, slides up on activation
- **Minimal height calculation**: Dynamic sizing based on content only
  - Header: Single line with efficient text sizing
  - Canvas: Fixed height for consistent piano roll display
  - Border/padding: Minimal spacing
  - **Total height**: Compact design compared to full-screen alternatives

#### Space Optimization Techniques
1. **Single-line header**: All information consolidated horizontally
2. **Removed default messages**: No placeholder content when inactive
3. **Eliminated excess padding**: Minimal CSS padding throughout
4. **Removed excess margins**: Streamlined spacing between components
5. **Compact typography**: Appropriate text sizing for space efficiency

#### Professional Piano Roll Canvas
- **Fixed dimensions**: Appropriate height matching DAW standards
- **Real-time highlighting**: Current note visualization during playback
- **Dark theme**: Dark background with rounded borders
- **Responsive width**: Adapts to panel width automatically
- **Smooth animation**: High frame rate playhead movement with note highlighting

#### Modern DAW-Style Interface
- **Professional piano roll**: DAW-style visualization with real-time note highlighting during playback
- **Ultra-compact panel design**: Minimal vertical space usage - single header line with all information
- **Optimized layout**: Sequence name, description, and stats all on one horizontal line
- **Minimal spacing**: Removed unnecessary spacing and padding for maximum compactness
- **Clean information hierarchy**: Single line format with sequence info on left, stats and controls on right

#### Cultural Musical Sequences
- **Authentic Turkish Makam**: 
  - Makam Hicaz: Classic Turkish makam with distinctive augmented second
  - Makam Rast: Fundamental makam bringing happiness and tranquility  
  - Makam Uşşâk: Beloved makam often used in prayer calls
  - Semazen Whirling: Mystical Sufi melody for spiritual dance (9/8 time)

- **Authentic Persian Dastgah**:
  - Dastgah Shur: Most beloved Persian mode expressing melancholy and longing
  - Dastgah Mahur: Majestic mode similar to Western major but with Persian character
  - Dastgah Segah: Complex mode with neutral thirds, profound and contemplative
  - Persian Tahrir: Virtuosic vocal ornament technique in Persian classical music

#### Advanced Audio System
- **Polyphonic sequencer**: Multiple overlapping notes with natural decay based on instrument characteristics
- **Instrument simulation**: Different wave types and filtering for various instrument sounds
- **Tempo synchronization**: Adjustable BPM with real-time changes
- **Visual feedback**: Piano roll playhead with real-time note highlighting
- **Spiral integration**: Sequence notes mapped to spiral with zoom control

#### User Interface Refinements  
- **Ultra-compact design**: Minimal vertical space usage throughout
- **Single-line header**: All sequence information consolidated efficiently
- **Professional styling**: DAW-inspired interface with proper layering
- **Responsive controls**: Tempo, style, and instrument selection
- **Cultural authenticity**: Accurate musical terminology and sequence descriptions
- **Space optimization**: Streamlined design with minimal placeholder content

### Tuning System Comparison
- **Visual overlay**: Multiple systems simultaneously active
- **Consonance analysis**: Where different systems align or diverge
- **Color hierarchy**: Most fundamental systems render with higher opacity
- **Interactive exploration**: Toggle systems to see relationships

### Harmonic Relationship Visualization
- **Multiple arc layers**: Concentric circles prevent visual overlap
- **Ratio intelligence**: Automatic simple fraction detection
- **Cents accuracy**: Precise deviation measurements
- **Interactive labels**: Rich information display on hover/click

## Future Enhancements

### Pitch-Bend and Microtonal Ornaments (Recommended Implementation)

#### Overview
Many world music systems require continuous pitch variation (pitch-bends) for authentic performance. This is essential for:
- **Arabic/Turkish Makam**: Subtle microtonal inflections and slides
- **Hindustani Classical**: Gamakas (melodic ornaments) with continuous pitch movement
- **Carnatic Classical**: Complex gamakas including oscillations, slides, and curves
- **Persian Dastgah**: Tahrir ornaments and microtonal expression
- **Blues and Jazz**: Expressive pitch bending

#### Technical Implementation Strategy

##### 1. Enhanced Oscillator Control
```javascript
class PitchBendOscillator {
  constructor(baseFreq, audioContext) {
    this.baseFreq = baseFreq;
    this.oscillator = audioContext.createOscillator();
    this.gain = audioContext.createGain();
    
    // Key addition: frequency modulation for pitch bends
    this.frequencyControl = audioContext.createGain();
    this.frequencyControl.gain.value = baseFreq;
    this.frequencyControl.connect(this.oscillator.frequency);
  }
  
  // Smooth pitch bend over time
  bendTo(targetFreq, duration, curve = 'linear') {
    const currentTime = this.audioContext.currentTime;
    this.frequencyControl.gain.cancelScheduledValues(currentTime);
    
    switch(curve) {
      case 'exponential':
        this.frequencyControl.gain.exponentialRampToValueAtTime(targetFreq, currentTime + duration);
        break;
      case 'sigmoid':
        // Custom sigmoid curve for natural-sounding bends
        this.applySigmoidBend(targetFreq, duration);
        break;
      default:
        this.frequencyControl.gain.linearRampToValueAtTime(targetFreq, currentTime + duration);
    }
  }
  
  // Oscillating gamaka (for Indian classical)
  gamaka(centerFreq, oscillationRange, speed, duration) {
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    lfo.frequency.value = speed; // Hz
    lfoGain.gain.value = oscillationRange; // cents variation
    
    lfo.connect(lfoGain);
    lfoGain.connect(this.frequencyControl.gain);
    
    setTimeout(() => {
      lfo.stop();
    }, duration * 1000);
  }
}
```

##### 2. Gesture Recognition System
```javascript
class PitchBendGestureHandler {
  constructor(canvas, spiralInstance) {
    this.canvas = canvas;
    this.spiral = spiralInstance;
    this.isDrawing = false;
    this.bendPath = [];
    this.activePoint = null;
  }
  
  // Detect pitch-bend gestures on canvas
  onMouseDown(event) {
    const point = this.spiral.getNearestPinnedPoint(event.x, event.y);
    if (point && event.shiftKey) { // Shift+drag for pitch bend
      this.isDrawing = true;
      this.activePoint = point;
      this.bendPath = [{x: event.x, y: event.y, time: 0}];
    }
  }
  
  onMouseMove(event) {
    if (this.isDrawing) {
      const timeFromStart = Date.now() - this.bendStartTime;
      this.bendPath.push({x: event.x, y: event.y, time: timeFromStart});
      
      // Real-time pitch bend based on vertical movement
      const bendAmount = (event.y - this.bendPath[0].y) * this.spiral.getBendSensitivity();
      const targetFreq = this.activePoint.frequency * Math.pow(2, bendAmount / 1200); // cents to ratio
      
      this.activePoint.oscillator.bendTo(targetFreq, 0.05, 'linear');
    }
  }
  
  onMouseUp(event) {
    if (this.isDrawing) {
      this.recordBendSequence();
      this.isDrawing = false;
    }
  }
}
```

##### 3. Arpeggiator Integration
```javascript
// Enhanced arpeggiator with pitch-bend support
class EnhancedArpSequencer extends ArpSequencer {
  playNoteWithBends(note, duration, instrument) {
    const oscillator = new PitchBendOscillator(note.freq, this.audioContext);
    
    // Apply system-specific ornaments
    if (this.currentTuningSystem.includes('hindustani') || this.currentTuningSystem.includes('carnatic')) {
      this.applyGamaka(oscillator, note, duration);
    } else if (this.currentTuningSystem.includes('arabic') || this.currentTuningSystem.includes('turkish')) {
      this.applyMaqamInflection(oscillator, note, duration);
    } else if (this.currentTuningSystem.includes('persian')) {
      this.applyTahrir(oscillator, note, duration);
    }
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }
  
  applyGamaka(oscillator, note, duration) {
    // Different gamaka types for Indian classical
    const gamakaType = note.gamakaType || 'kampita'; // oscillating
    
    switch(gamakaType) {
      case 'kampita': // Oscillating
        oscillator.gamaka(note.freq, 25, 6, duration * 0.8); // 25 cents, 6Hz
        break;
      case 'andolita': // Gentle swing
        oscillator.bendTo(note.freq * 1.02, duration * 0.3);
        oscillator.bendTo(note.freq * 0.98, duration * 0.7);
        break;
      case 'sphurita': // Rapid ornament
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            oscillator.bendTo(note.freq * 1.03, 0.1);
            setTimeout(() => oscillator.bendTo(note.freq, 0.1), 100);
          }, i * 200);
        }
        break;
    }
  }
  
  applyMaqamInflection(oscillator, note, duration) {
    // Subtle microtonal inflections for Arabic/Turkish
    if (note.requiresBend) {
      oscillator.bendTo(note.freq * 1.005, duration * 0.2); // Very subtle
      oscillator.bendTo(note.freq, duration * 0.8);
    }
  }
  
  applyTahrir(oscillator, note, duration) {
    // Persian vocal ornament style
    if (note.isTahrirNote) {
      oscillator.bendTo(note.freq * 1.04, duration * 0.1, 'exponential');
      oscillator.bendTo(note.freq * 0.96, duration * 0.3, 'sigmoid');
      oscillator.bendTo(note.freq, duration * 0.6, 'linear');
    }
  }
}
```

#### User Interface Integration

##### 1. Pitch-Bend Controls
- **Bend Sensitivity Slider**: Control how much vertical mouse movement affects pitch
- **Bend Mode Toggle**: Enable/disable pitch-bend gestures
- **Ornament Presets**: Quick access to cultural ornament styles
- **Record/Playback**: Save and replay pitch-bend sequences

##### 2. Visual Feedback
- **Bend Curves**: Real-time visualization of pitch movement as colored curves
- **Gamaka Indicators**: Visual symbols showing ornament types
- **Pitch Range Display**: Show current pitch deviation in cents

##### 3. Cultural Authenticity Features
```javascript
// Predefined ornament patterns for different traditions
const ORNAMENT_PATTERNS = {
  hindustani: {
    meend: { // Glide between notes
      type: 'glide',
      duration: 0.3,
      curve: 'sigmoid'
    },
    krintan: { // Rapid oscillation
      type: 'oscillation',
      speed: 8,
      range: 30,
      duration: 0.5
    }
  },
  carnatic: {
    jaru: { // Quick slide
      type: 'glide',
      duration: 0.1,
      curve: 'exponential'
    },
    nokku: { // Gentle touch
      type: 'touch',
      bendAmount: 15,
      duration: 0.2
    }
  },
  arabic: {
    tahwil: { // Microtonal inflection
      type: 'inflection',
      bendAmount: 8,
      timing: 'start'
    }
  }
};
```

#### Implementation Priority

##### Phase 1: Basic Pitch-Bend
1. **Mouse gesture recognition** for pitch bending pinned points
2. **Real-time frequency modulation** using Web Audio API
3. **Visual feedback** showing pitch curves
4. **Simple bend presets** (linear, exponential, sigmoid)

##### Phase 2: Cultural Ornaments
1. **Arpeggiator integration** with ornament support
2. **Predefined gamaka patterns** for Indian systems
3. **Maqam inflection patterns** for Arabic/Turkish systems
4. **Persian tahrir ornaments**

##### Phase 3: Advanced Features
1. **Gesture recording and playback**
2. **Multi-touch support** for complex ornaments
3. **AI-assisted ornament suggestions** based on musical context
4. **Export functionality** for pitch-bend sequences

#### Technical Considerations

##### Performance Optimization
- **Efficient curve calculation**: Pre-compute common bend curves
- **Gesture smoothing**: Filter mouse input to prevent audio artifacts
- **Memory management**: Clean up completed bend sequences
- **Audio latency**: Minimize delay between gesture and audio response

##### Cross-Platform Compatibility
- **Touch device support**: Adapt gestures for tablets and phones
- **Precision requirements**: Different sensitivity for different input devices
- **Accessibility**: Keyboard alternatives for pitch-bend control

This pitch-bend implementation would significantly enhance the authenticity of world music system playback while maintaining the educational and exploratory nature of Microtuna.

### Cross-Tuning System Mapping (Planned Feature)
*This feature was prototyped but removed due to complexity. Planned for future implementation.*

#### Concept
- **Dropdown selection**: Tuning system selector next to toggle button
- **Mapping mode**: Toggle button to activate/deactivate cross-system mapping
- **Real-time conversion**: Map current sequence notes to equivalent pitches in target tuning system
- **Visual indication**: Different colors/styling for mapped vs original notes

#### Proposed Interface
- **Dropdown placement**: Left of map toggle button in arpeggiator header
- **Systems available**: All tuning systems except currently selected one
- **Toggle behavior**: "Map" button becomes "Exit" when active, enables dropdown
- **Visual feedback**: Piano roll shows mapped notes in different color scheme

#### Technical Implementation Notes
- **Frequency matching**: Find closest equivalent frequencies between tuning systems
- **Ratio preservation**: Maintain harmonic relationships where possible  
- **Fallback handling**: Graceful degradation when direct mapping not possible
- **Performance**: Real-time conversion without audio interruption

#### User Experience Goals
- **Intuitive workflow**: Simple dropdown + toggle approach
- **Educational value**: Hear how same melody sounds in different tuning systems
- **Minimal UI impact**: No additional panels or complex controls
- **Quick comparison**: Easy switching between original and mapped versions

## Installation and Dependencies

### External Dependencies
- **Bootstrap 5**: Complete UI framework with dark theme
- **Bootstrap Icons**: Icon font for UI elements  
- **Web Audio API**: Native browser audio synthesis
- **Canvas API**: 2D graphics rendering

### File Structure
```
microtuna/
├── index.html              # Complete HTML structure
├── main.css               # Custom styles and responsive design
├── main.js                # Full application logic (optimized)
├── arps.js                # Musical sequences for all tuning systems
└── spec.md                # This comprehensive specification
```

### Key Implementation Files

#### index.html Structure
- **Bootstrap 5 layout**: Dark theme with responsive design
- **Arpeggiator panel**: Ultra-compact bottom overlay panel
- **Optimized markup**: Single-line header, minimal nesting
- **No empty divs**: All placeholder content removed

#### main.css Optimizations  
- **Minimal padding**: Piano roll components optimized for space efficiency
- **Compact spacing**: Minimal margins and padding throughout
- **Professional styling**: DAW-inspired dark theme
- **Canvas sizing**: Fixed height for piano roll display

#### main.js Architecture
- **Simplified functions**: Streamlined arpeggiator functionality
- **Direct rendering**: Always show piano roll, no conditional logic
- **Clean event handling**: Streamlined arpeggiator activation
- **Optimized performance**: Reduced function calls and state management

### Browser Requirements
- **Modern browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **Web Audio support**: Required for audio features
- **Canvas support**: Required for visual rendering
- **ES6+ support**: Arrow functions, classes, Map/Set objects

### Implementation Notes
- **Compact design**: Arpeggiator panel with minimal height requirements
- **No empty space**: All unnecessary spacing eliminated
- **Professional appearance**: DAW-style interface with cultural authenticity
- **Performance optimized**: Minimal DOM manipulation and efficient rendering

This specification provides complete implementation details for recreating Microtuna from scratch, including all UI components, audio systems, mathematical calculations, and interface optimizations.
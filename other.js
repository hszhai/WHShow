function calculateTotalAmplitude(binAmps) {
  if (!Array.isArray(binAmps) || binAmps.length === 0) {
    console.error("Invalid or empty binAmps data provided.");
    return 0;
  }

  let totalAmp = binAmps.reduce((sum, item) => {
    return sum + (typeof item.amp === "number" ? item.amp : 0);
  }, 0);

  return totalAmp;
}




function draw_turn_indicator(turn) {
  let blinkState = frameCount % 60 < 30; // Assuming 60 frames per second

  let xPos, yPos;
  yPos = 50;

  if (turn === "left") {
    xPos = 50;
    fill(255, 0, 0);
  } else if (turn === "right") {
    xPos = width - 50;
    fill(0, 255, 0);
  } else {
    return;
  }

  if (blinkState) {
    ellipse(xPos, yPos, 30);
  }
}

function visualizeBinAmps(binAmps, group) {
  // Check if binAmps is an array and has elements
  if (!Array.isArray(binAmps) || binAmps.length === 0) {
    console.error("Invalid or empty binAmps data.");
    return; // Exit the function if validation fails
  }

  // Additional validation to ensure each element has an 'amp' property
  for (let i = 0; i < binAmps.length; i++) {
    if (typeof binAmps[i].amp !== "number") {
      console.error("Invalid binAmps data at index", i);
      return; // Exit if any element fails validation
    }
  }

  let x1 = width * 0.5,
    x2 = width * 0.5;
  let y1 = height * 0.5;
  //let y2 = random(height * 0.15, height * 0.25);
  let y2 = sun_y * random(0.8,1.2);
  if (group === "left") {
    x1 = width * 0.1;
    //x2 = width * 0.7;
  }
  if (group === "right") {
    x1 = width * 0.9;
    //x2 = width * 0.3;
  }

  // Visualization of binAmps with ellipses
  let lowFreq = 1,
    highFreq = 24;
  for (let i = 0; i < binAmps.length; i++) {
    let R = binAmps[i].amp;
    if (group === "left") {
      fill(
        R * (1 + i / highFreq) + 150 + 10,
        R + (1 + i / highFreq) * i * 0.9,
        100 - 10,
        (10 + 5 * (i - lowFreq) + 50)*0.5
      );
    }
    if (group === "right") {
      fill(
        R * (1 + i / highFreq),
        R + (1 + i / highFreq) * i + 150,
        100,
        (10 + 5 * (i - lowFreq) + 50)*0.5
      );
    }

    let pct = i / binAmps.length;
    let _x = lerp(x1, x2, pct);
    let _y = lerp(y1, y2, pct);
    let power = group === turn ? 1 : 0;
    ellipse(_x, _y, power * R * (1 + (i / highFreq) * 1.5));

    //ellipse(
    //  windowWidth / 2,
    //  windowHeight - (i - lowFreq) * 16 * (1 + i / highFreq) + 20,
    //  R * (1 + i / highFreq)
    //);
  }
}





function getDominantFrequency(spectrum) {
  let maxIndex = 0;
  let maxValue = 0;
  for (let i = 0; i < spectrum.length; i++) {
    if (spectrum[i] > maxValue) {
      maxValue = spectrum[i];
      maxIndex = i;
    }
  }
  return maxIndex * (sampleRate() / 2) / spectrum.length;
}

function isFrequencyStable(history) {
  if (history.length < stabilityThreshold) {
    return false;
  }
  let reference = history[0];
  for (let i = 1; i < history.length; i++) {
    if (abs(reference - history[i]) > 1) {  // Allow for a minor fluctuation tolerance
      return false;
    }
  }
  return true;
}

function frequencyToNote(frequency) {
  const A4 = 440;
  const A4_MIDI = 69;
  if (frequency > 0) {
    let midiNum = 12 * (Math.log(frequency / A4) / Math.log(2)) + A4_MIDI;
    let noteIndex = Math.round(midiNum) % 12;
    let octave = Math.floor(Math.round(midiNum) / 12) - 1;
    let noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][noteIndex];
    return `${noteName}${octave}`;
  }
  return "N/A"; // In case of invalid frequency input
}


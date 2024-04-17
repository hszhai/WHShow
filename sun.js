class Sun {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.R = 100;
    this.redIntensity = 44;  // Starting intensity
    this.greenIntensity = 44;  // Starting intensity
    this.blueIntensity = 66;  // Fixed blue component for aesthetic
  }

  update() {
    if (!audioData || !audioData.bin_amps) {
      //console.log("No audio data available.");
      return;
    }

    if (audioData.turn !== audioData.group) {
      //console.log("Data group does not match the current turn.");
      return; 
    }

    // Calculate the sum of amplitudes only for the matching group and turn
    let sum = calculateTotalAmplitude(audioData.bin_amps);
    //console.log("Sum:", sum, "Turn:", audioData.turn);

    // Update color intensities based on the current turn
    if (audioData.turn === "left") {
      this.redIntensity = min(this.redIntensity + sum * 0.0025, 255);
    } else {
      this.greenIntensity = min(this.greenIntensity + sum * 0.0025, 255);
    }

    // Apply a fading effect for visual dynamics
    this.redIntensity = max(this.redIntensity - 2, 44);
    this.greenIntensity = max(this.greenIntensity - 2, 44);
  }

  display(sig) {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.redIntensity, this.greenIntensity, this.blueIntensity, 150);
    ellipse(0, 0, this.R + sig * 0.5);
    pop();
  }
}

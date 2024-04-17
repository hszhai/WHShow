class Ego {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseY = y; // Original Y position to return to when not activated
  }

  display() {
    // Draw the object, could be an ellipse for simplicity
    if(random()<0.9) return
    push()
    noStroke()
    //fill(200,0,0,10)
    fill('#d9770611')
    if(random()<0.2) fill('#14b8a633')
    ellipse(this.x+random(-0.2,0.2)*width,this.y,300,100)
    pop()
  }

  update(level) {
    // Check if the level is above the threshold
    if (level > 0.1) { // Threshold can be adjusted
      this.y -= 10; // Move the object up
    } else {
      this.y += (this.baseY - this.y) * 0.1; // Smooth return to base position
    }

    this.y = constrain(this.y, this.baseY - 100, this.baseY); // Limit movement range
  }
}

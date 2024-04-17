class FallingPoint {
  constructor(x, y) {
    this.x = x || random(width);
    this.y = y || 0; // Start from the top if no y-coordinate is given
    this.velocityY = random(3, 5); // Speed of falling
    this.size = 10;
    this.active = true; // Initially active
  }

  update() {
    if (!this.active) {
      return false; // If already inactive, skip processing
    }

    this.y += this.velocityY; // Move down each frame

    // Check if the point is below the bottom of the screen
    if (this.y > height) {
      this.active = false; // Set active to false if the point should be deleted
      return false;
    }
    return true; // Return true to keep the point active
  }

  display() {
    if (!this.active) {
      return; 
    }
  }

  interactWithDusts(dusts, range = 50) {
    if (!this.active) {
      return; // Skip interaction if not active
    }

    stroke(255);
    for (let du of dusts) {
      let distance = dist(this.x, this.y, du.x, du.y);
      if (distance < range) { // Interaction threshold
        line(this.x, this.y, du.x, du.y);
      }
    }
  }
}

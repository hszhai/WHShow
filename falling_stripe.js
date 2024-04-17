class FallingStripe {
  constructor(x, y, w = 50, h = 200, speed = 0.5) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.active = true;  // This flag will indicate if the stripe should still be updated and drawn
    this.n_lines = 3
  }

  update() {
    this.y += this.speed; // Move the stripe down by its speed
    if (this.y > height) {  // Assuming `height` is the height of your canvas
      this.active = false; // Deactivate the stripe if it moves off the screen
    }
  }

  display() {
    //if (!this.active) return;  // Only draw if the stripe is active

    fill('orange');
    rect(this.x,this.y,this.w,this.h)
    stroke(200,200);
    for(let i=0;i<this.n_lines;i++) {
      let _y = this.y + i*this.h/this.n_lines
      line(this.x,_y,this.x+this.w,_y)
    }
  }
  
  reset(y, w = this.w) {
    this.y = y;
    this.w = w;
    this.x = this.originalX - this.w / 2;  // Center the stripe based on new width
    this.active = true;
  }
}

class DeuxRail {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.noiseScale = 0.1;

    this.r1s = [];
    this.r2s = [];
    this.build(200);
  }

  build(n) {
    // Update method call to use named parameters
    const pathParams = { x: this.x, y: this.y, n: n, noise_scale: this.noiseScale, step: 25 };
    this.r1s = PFac.path_pts(pathParams);
    this.r2s = PFac.path_pts(pathParams);
  }

  update() {
    // Implementation for updating rail positions or properties, if needed
  }

  display() {
    for (let i = 0; i < this.r1s.length; i++) {
      let p1 = this.r1s[i];
      let p2 = this.r2s[i];
      line(p1.x, p1.y, p2.x, p2.y);
      ellipse(p1.x,p1.y,5)
    }
  }
}

class Bird {
  constructor(x, y, lifespan = 300) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.maxSpeed = 2;
    this.maxForce = 0.015;
    this.lifespan = lifespan;  // Lifespan in frames (e.g., 300 frames)
    this.alive = true;  // State of the bird, alive or not
    this.gravity = createVector(0, 0.005); // Gravity vector pointing down

  }
  
  applyLift() {
    let lift = createVector(0, -0.0025);  // Simple lift force that negates gravity
    this.applyForce(lift);
  }

  run(birds) {
    if (this.alive) {
      if (Math.random() < 0.1) {  
        this.applyForce(p5.Vector.random2D().mult(this.maxForce));
      }
      this.applyForce(this.gravity); // Apply gravity each frame
      if(random()<0.2) this.applyLift();               // Apply lift to simulate flapping wings

      this.flock(birds);
      this.update();
      this.borders();
      this.render();
      this.checkLifespan();  // Check lifespan each frame
    }
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  flock(birds) {
    let sep = this.separate(birds);   
    let ali = this.align(birds);      
    let coh = this.cohesion(birds);   
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan--;  // Decrease lifespan each frame
  }

  checkLifespan() {
    if (this.lifespan <= 0) {
      this.alive = false;  // Mark as not alive when lifespan is up
    }
  }

  separate(birds) {
    let desiredSeparation = 20.0;
    let steer = createVector(0, 0);
    let count = 0;
    for (let other of birds) {
      let d = p5.Vector.dist(this.position, other.position);
      if ((d > 0) && (d < desiredSeparation)) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d); 
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  align(birds) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of birds) {
      let d = p5.Vector.dist(this.position, other.position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  cohesion(birds) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of birds) {
      let d = p5.Vector.dist(this.position, other.position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.position);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    } else {
      return createVector(0, 0);
    }
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }

  borders() {
    if (this.position.x < 0 || this.position.x > width || this.position.y < 0 || this.position.y > height) {
      this.alive = false;  // Bird dies if it goes out of the canvas
    }
  }

  render() {
    if (this.alive) {
      let theta = this.velocity.heading() + radians(90);
      noFill()
      strokeWeight(random(2,3))
      //stroke(200,50);
      stroke('#38bdf844')
      if(random()<0.24) stroke('#7dd3fc');
      if(random()<0.2) stroke('#a5f3fc')
      point(this.position.x, this.position.y);
      // push();
      // translate(this.position.x, this.position.y);
      // rotate(theta);
      // beginShape();
      // vertex(0, -6);
      // vertex(-2, 6+random(5));
      // vertex(2, 6);
      // endShape(CLOSE);
      // pop();
    }
  }
}

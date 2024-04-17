class Flock {
  constructor(maxBirds=100) {
    this.birds = [];
    this.maxBirds = maxBirds; // Maximum number of birds allowed in the flock
  }

  addBird(b) {
    if (this.birds.length >= this.maxBirds) {
      this.birds.shift(); // Remove the oldest bird from the start of the array
    }
    this.birds.push(b); // Add the new bird to the end of the array
  }

  run() {
    for (let i = this.birds.length - 1; i >= 0; i--) {
      this.birds[i].run(this.birds);
      if (!this.birds[i].alive) {
        this.birds.splice(i, 1);  // Remove the dead bird from the array
      }
    }
  }
}

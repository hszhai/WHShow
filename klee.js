class Klee {
  constructor({ x0 = 0, y0 = 0, midis = [] } = {}) {
    this.x0 = x0;
    this.y0 = y0;
    this.midis = midis;
    this.notes = [];
    this.updateNotes(this.midis);
  }

  updateNotes(midis, x0, y0) {
    console.log("Klee updatenotes", midis)
    this.notes = [];
    this.x0 = x0;
    this.y0 = y0;
    let spacing = 25; //44
    for (let i = 0; i < midis.length; i++) {
      let midi = midis[i];
      // make duration longer, for more drawing
      let note = new Note(
        midi.note,
        this.x0 + random(spacing),
        this.y0 - i * spacing,
        midi.duration * 5,
        midi.time + 20 * i
      );
      this.notes.push(note);
    }
  }
  
  update(t) {
    for(let note of this.notes) {
      note.update(t)
    }
  }

  _display(sig = 0) {
    // this,nodes display is handled by main sketch.js
    stroke("skyblue");
    noFill();
    strokeWeight(2);

    beginShape();
    for (let i = 0; i < this.notes.length; i++) {
      let note = this.notes[floor(i)];
      if (note.active) curveVertex(note.x, note.y);
    }
    endShape();
  }

  display(sig = 0, t) {
    //stroke("skyblue");
    noFill();
    stroke(194,144)
    if(random()<0.4) stroke(204,144)
    strokeWeight(1);
    if(random()<0.4) strokeWeight(0.8)


    beginShape();
    for (let i = 0; i < this.notes.length; i++) {
      let note = this.notes[i];
      if (note.active) {
        let modX = note.x + random(-sig * 10, sig * 10);
        let modY = note.y + random(-sig * 10, sig * 10);
        curveVertex(modX, modY);
      }
    }
    endShape();

    for(let note of this.notes) {
      note.display(sig, t)
    }
    
  }
}

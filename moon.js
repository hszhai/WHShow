class Moon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.update_rate = 0.01;

    this.dest = [];
    // make 16 notes: max number to update
    this.pts = [];
    for (let i = 0; i < 16; i++) {
      this.pts.push(createVector(x, y));
    }
  }

  update_bar(notes, x, y) {
    this.x = x
    this.y = y
    
    this.dest = [];
    for (let i = 0; i < notes.length; i++) {
      let noteObject = notes[i]; // Get the note object from the array
      let noteName = noteObject.note; // Access the 'note' property of the object
      let theta = (i * TWO_PI) / notes.length;
      let midi_number = Music.noteNameToMidiNumber(noteName); 
      let r = map(midi_number, 40, 108, 2, 50);
      let _x = this.x + r * cos(theta);
      let _y = this.y + r * sin(theta);
      this.dest.push(createVector(_x, _y));
    }
    // console.log(
    //   "update_bar",
    //   notes.map((n) => n.note),
    //   this.dest
    // ); 
  }

  update(level) {
    if (this.dest.length > 0) {
      for (let i = 0; i < this.pts.length; i++) {
        this.pts[i].x = lerp(
          this.pts[i].x,
          this.dest[i % this.dest.length].x,
          this.update_rate
        ) + random(-level,level);
        this.pts[i].y = lerp(
          this.pts[i].y,
          this.dest[i % this.dest.length].y,
          this.update_rate
        ) + random(-level,level);
      }
    }
  }
  
  near(dusts, th) {
    strokeWeight(0.5)
    if(random()<0.4) strokeWeight(0.25)

    //fill('yellow')
    //Rect(this.x,this.y,100,100)

    for(let pt of this.pts) {
      if(random()<0.4) for(let dust of dusts ) {
        stroke('#14b8a6')
        if(random()<0.2) stroke('#facc15');
        if(random()<0.4) {
          stroke('#bef264')
        }
        if(random()<0.5 && dist(pt.x,pt.y,dust.x,dust.y)<th) {   // 0.25
          line(pt.x,pt.y,dust.x,dust.y)
        }
      }
    }
  }

  display(sig) {
    return
    
    push();
    //translate(this.x, this.y);

    //ellipse(0, 0, sig);

    stroke(200, 0, 0);
    strokeWeight(5)
    noFill()
    if (this.pts.length >= 4) {
      beginShape();
      for (let pt of this.pts) {
        curveVertex(pt.x, pt.y);
        //ellipse(pt.x, pt.y, random(10));
      }
      curveVertex(this.pts[0].x, this.pts[0].y);
      curveVertex(this.pts[1].x, this.pts[1].y);
      curveVertex(this.pts[2].x, this.pts[2].y);
      endShape();
    }

    pop();
  }
}

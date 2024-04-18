class Note {
  constructor(note, x, y, duration, start_time) {
    this.note = note;
    this.x = x;
    this.y = y;
    this.duration = duration;
    this.timeLeft = duration; 
    this.start_time = start_time
    this.active = false
    
    this.p1s = PFac.random_around({n:30})
    this.p2s = PFac.random_around({x:80,randomness:0.5, n:30})
    this.order1 = this.pick(35)
  }
  
  pick(n) {
    let rs = []
    for(let i=0;i<this.p1s.length;i++) {
      rs.push(Math.floor(random(this.p1s.length)))
    }
    return(rs)
  }

  // update() {
  //   this.timeLeft -= deltaTime; 
  // }
  
  update(current_time) {
    if (current_time >= this.start_time && current_time < this.start_time + this.duration) {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  display(sig=0, current_time) {
    if (!this.active) return;  
    
    push();
    
    const elapsedTime = current_time - this.start_time;
    const scaleSize = map(elapsedTime, 0, this.duration, 0.1, 1);
    
    translate(this.x, this.y - scaleSize*30);
    
    noStroke()
    fill('#f97316cc')
    if(random()<0.3) fill('#d946efaa')
    if(random()<0.1) {
      ellipse(random(-15,15),random(-15,15),random(3,8))
    }

    let _s = constrain(0.2 + scaleSize*sig, 0.2, 10.0)
    scale(_s);
    
    const octave = parseInt(this.note.slice(-1), 10);
    const noteName = this.note.slice(0, -1);
    
    stroke(255,100)
    //stroke('#14b8a6')
    if(random()<0.1) stroke('#dc2626')
    if(random()<0.2) stroke('#facc15');
    if(random()<0.4) {
          stroke('#bef264')
    }
    
    switch (noteName) {
      case 'C#':
        push()
        strokeWeight(0.2)
        fill(0,10);
        ellipse(random(3), 0, 10, 10);
        noFill();
        for(let i=0;i<2+octave;i++) {
          ellipse(random(20),random(5),35,20)
          rotate(random(0.24,0.44))
        }
        pop()
        break;
      case 'E':
        push()
        strokeWeight(0.1)
        noFill()
        scale(0.9)
        rotate(-1.9)
        for(let i=0;i<random(5,10)+octave*2;i++) {
          scale(1.015)
          rotate(0.33)
          text('࿐',10,-5)
        }
        pop()
        break;
      case 'A':
        fill(200,20);
        //triangle(-10, 20, 0, 0, 10, 20);
        push()
        strokeWeight(0.25)
        textSize(28)
        rotate(random(0.1))
        text('𓆟',0,0)
        rotate(0.2)
        textSize(34)
        text('𓆟',20,10)
        pop()
        push()
        scale(0.25,0.5)
        for(let i=0;i<this.p1s.length-1;i++) {         
          let p1 = this.p1s[i]
          let p1n = this.p1s[i+1]
          let p2 = this.p2s[i]
          let p2n = this.p2s[i+1]         
          line(p1.x,p1.y, p2.x,p2.y)
          //quad(p1.x,p1.y, p2.x,p2.y,p1n.x,p1n.y, p2n.x,p2n.y) 
        }
        pop()
        break;
      case 'F#':
        push()
        fill('yellow');
        arc(0, 0, 20, 20, 0, HALF_PI);
        noFill()
        let inds=[0,2,3,5,11,2,0]
        let inds1=[0,2,3,5,20,25,2,0]
        //beginShape()
        scale(0.5)
        for(let ind of inds) {
          let p = this.p1s[ind % this.p1s.length]
          //curveVertex(p.x,p.y)
          ellipse(p.x+random(20),p.y+random(70),15)
          ellipse(p.x+10,p.y+10,10)
          ellipse(p.x,p.y,8)
        }
        //endShape()
        beginShape()
        for(let ind of inds1) {
          let p = this.p1s[ind % this.p1s.length]
          //curveVertex(p.x+12,p.y+10)
        }
        endShape()
        pop()
        break;
      case 'G#':
        push()
        noFill()
        scale(0.5)
        strokeWeight(0.5)
        beginShape()
        for(let ind of this.order1) {
          let p1 = this.p1s[ind % this.p1s.length]
          curveVertex(p1.x,p1.y)
          if(random()<0.1) {
            let p2 = this.p2s[ind % this.p1s.length]
            curveVertex(p2.x,p2.y)            
          }
        }
        endShape()   
        pop()
        break;
      case 'D#':
        push()
        noFill()
        //rotate(random(-1,1))
        strokeWeight(0.5)
        rect(random(5), 5, 20, 20,5);
        rect(0, random(5), 5, 5);
        rect(-10, random(5)+10, 30, 30, 5);
        fill(200,10)
        rect(0, random(5), 10, 10,2);
        rect(15, 15+random(5), 12, 12,2);
        pop()
        break;
      case 'B':
        fill('pink');
        quad(-5, -5, 0, 0, 5, -5, 10, 0);
        break;
    }
    pop();
  }
}

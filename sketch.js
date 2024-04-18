let debug = false
let SHOWFR = false

let scene = 'A'   // 'B'

let socket;
let audioData = []
let binAmpsData = [];
let group;
let turn;
let timeoutDuration = 5000; // 5000 milliseconds
let lastDataTime; 

let sun;
let sun_x, sun_y
let moon;

// two signal source: song, mic
// music: MIDI score
let mic, fft;
let song;
let amp;
let music;

let current_time
let ready = false;
let start_time;
let lastMeasureTime = -Infinity
let measureDuration = 2727; // one m in milliseconds.


// env
let dusts = [];
let num_dusts = 1000;
let falling_points = []
const MAX_FALLING_POINTS = 10;

let flock

let klee
let kpos_x, kpos_y
let notes = [];



function preload() {
  loadJSON("assets/arab_p2.json", (data) => {
    music = new Music(data);
    //stats = music.calculateNoteStatistics()
    //console.log(stats)
  });
  
  song = loadSound("assets/Arabesque_Ida_full_ex.mp3", ()=>{
    console.log("Song loaded and ready to play.");
    ready = true;
  });

  song.onended(function() {
    console.log("Song ended. Restarting ...");
    song.play()
    start_time = millis()
    lastMeasureTime = -Infinity
    music = new Music()
  });

}



function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(1920, 1080);
  socket = io.connect("https://whitehorse.glitch.me");

  socket.on("touchEvent", (data) => {
    console.log("Touch event received:", data);
    let _x = map(data.x,0,360,0.2*width,0.8*width)   // app width is 360
    let _y = random(0.4) * height;    // randomize y on top
    let newPoint = new FallingPoint(_x, _y);
    if (falling_points.length >= MAX_FALLING_POINTS) {
      falling_points.shift();  // Remove the oldest point
    }
    falling_points.push(newPoint);
  });
    
  socket.on("audioData", (data) => {
    binAmpsData = data.bin_amps;
    group = data.group;
    turn = data.turn;
    // Store the complete data
    audioData = data;  // a global object {bin_amps, group, turn}

    lastDataTime = millis(); 
    sun.update();
  });
  lastDataTime = millis(); 

  mic = new p5.AudioIn();
  mic.start();
  //fft = new p5.FFT(0.8, 1024);
  //fft.setInput(mic);
  amp = new p5.Amplitude();
  
  
  if(!song.isPlaying() && ready) {
    song.play()
    start_time = millis() 
    current_time = 0
    lastMeasureTime = -Infinity
  }
  
  
  for (let i = 0; i < num_dusts; i++) {
    dusts.push(createVector(random(0.1,0.9)*width, random(0.1,0.8)*height));
  }
  
  flock = new Flock()
  
  sun_x = width * 0.5
  sun_y = height * 0.2

  sun = new Sun(sun_x, sun_y);
  moon = new Moon(sun_x, sun_y + 100);

  //deux = new DeuxRail(width/2, height/2);
  ego = new Ego(width * 0.5, height * 0.95);
    
  klee = new Klee();
  kpos_x = width * 0.8
  kpos_y = height * 0.905
  
  background('#0d9488');  
  //song.setVolume(0.0);
}



function draw() {
  
  scene = 'A'         // 'B', for future use
  
  if(frameCount%20==0) background('#0d948811');
  // if ((frameCount % 600) < 100 && frameCount % 2 == 0){ 
  //   background('#0d948811');
  // }  
  fading_top_bottom();  
  
  let level = amp.getLevel();
  // console.log("amp level", level) // smalle number, 0.04 range
  let micLevel = mic.getLevel();
  ego.update(micLevel * 100);
  //console.log(micLevel);

  current_time = millis() - start_time;
  if (current_time >= lastMeasureTime + measureDuration) {
    lastMeasureTime = current_time - (current_time % measureDuration);
    processMIDINotes(current_time, level);
  }


  
  flock.run()

  if(false) {
    let spectrum = fft.analyze();
    let currentFrequency = getDominantFrequency(spectrum);

    // Update frequency history
    frequencyHistory.push(currentFrequency);
    if (frequencyHistory.length > stabilityThreshold) {
      frequencyHistory.shift(); 
    }

    if (isFrequencyStable(frequencyHistory)) {
      stableFrequency = currentFrequency;
      fill(0, 255, 0);  // Green color for stable
    } else {
      fill(255, 0, 0);  // Red color for changing
    }

    fill("red");
    rect(0, 0, 100, stableFrequency);    
  }


  fill(200, 0, 0, 120);

  //
  //  moon adjustments: flying greens
  //
  moon.update(level*100);
  //moon.near(dusts, min(level * 800, 1000));
  //moon.near(dusts, 40 + random(20) + level * 100);
  moon.near(dusts, 30 + random(40) + level * 200);
  moon.display(level * 150);
  ego.display();


  // for (let du of dusts) {
  //   stroke(200);
  //   if (dist(du.x, du.y, mouseX, mouseY) < 50) {
  //     line(du.x, du.y, mouseX, mouseY);
  //   }
  // }
  
  for (let i = falling_points.length - 1; i >= 0; i--) {
    if (!falling_points[i].update()) {
      // If update returns false (inactive), remove the point
      falling_points.splice(i, 1);
    } else {
      falling_points[i].display();
      falling_points[i].interactWithDusts(dusts);
    }
  }

  fill(255);
  

  sun.update();
  sun.display(level * 50);
  //console.log("mic ",micLevel)
  
  // when no data received, timeout t
  if (millis() > lastDataTime + timeoutDuration) {
    binAmpsData = []; // Flush the binAmpData   
    audioData = []
    turn = undefined
    lastDataTime = millis(); 
  }

  if(SHOWFR && frameCount%5==0) {
    fill(255)
    rect(0, 0, 100, 100);
    fill(255, 0, 0);
    textSize(30);  
    text(current_time.toFixed(0), 10, 50)
    text(frameRate().toFixed(1), 10, 80)
  }

  
  klee.update(current_time)
  klee.display(micLevel*20, current_time)
  
  
  // if(scene==='B') {
  //   if(frameCount%10===0) {
  //       let newPoint = new FallingPoint(mouseX, mouseY);
  //       falling_points.push(newPoint);
  //   }
  // }

  let radius = map(micLevel, 0, 0.2, 0, 300); // Adjust max size as needed
  stroke('#38bdf888');  
  let _above = 400
  ellipse(kpos_x, kpos_y - _above, 0.5+radius);

  // Create or add to the flock when the mic level exceeds a threshold
  if (micLevel > 0.05) {  
    let newBirds = 10; // Number of birds to add
    for (let i = 0; i < newBirds; i++) {
      let b = new Bird(kpos_x, kpos_y - _above);
      flock.addBird(b);
    }
  }
   
  if (binAmpsData.length > 0) {
    noStroke()
    visualizeBinAmps(binAmpsData, group);
  }

  draw_turn_indicator(turn);
}


function keyPressed() {
  if(key==='b') {
      for (let i = 0; i < 80; i++) {
        let b = new Bird(sun_x, sun_y);
        flock.addBird(b);
    }
  }
}

function processMIDINotes(currentTime, level) {
  let nn = music.notes_at(currentTime, measureDuration);
  let _x = random(0.4 - level, 0.6+level) * width;
  let _y = random(0.06, 0.66+level) * height;
  moon.update_bar(nn, _x, _y);
  
  kpos_x = random(0.3, 0.7) * width;  // Randomize positions for visual elements
  kpos_y = random(0.75, 0.95) * height;
  klee.updateNotes(nn, kpos_x, kpos_y);
  
  if (debug) {
    console.log('===================');
    console.log(currentTime, nn);
  }
}


function fading_top_bottom() {
  // Fade top and bottom of the screen at intervals
  if (frameCount % 2 == 0) {
    push();
    noStroke();
    fill(0, 10);
    rect(0, 0, width, height * random(0.3, 0.6));
    let _h = height * random(0.4);
    rect(0, height - _h, width, _h);
    pop();
  }
}


function mouseClicked() {
  let newPoint = new FallingPoint(mouseX, mouseY);
  falling_points.push(newPoint);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

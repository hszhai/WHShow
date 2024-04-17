class _Music {
  
  constructor(_json, frame_rate = 30) {
    this.midi = Music.loadMusic(_json, frame_rate)
    console.log(this.midi)
    
    // let sss = this.midi.filter(note=>note.time<100)
    // console.log(sss)
    // for(let s of sss) {console.log("sss",s)}
  }
    
  static loadMusic(data, frame_rate) {
    let processedData = [];
    // the mdid is delayed, starting at 70 frames
    Object.values(data).forEach((n, index) => {
      processedData.push({
        note: n.note,
        time: Math.floor(n.time*frame_rate -69),
        duration: Math.floor(n.duration*frame_rate),
      });
    });
    return processedData;
  }
  
  notes_at(f,dur=0) {
    return this.midi.filter(note=>note.time>=f && note.time<=f+dur)
  }

  // TODO: need to add support for flat notes
  static noteNameToMidiNumber(note) {
    const notes = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const octave = parseInt(note.slice(-1), 10);
    const noteName = note.slice(0, -1);
    const noteIndex = notes.indexOf(noteName);
    return 12 * (octave + 1) + noteIndex;
  }

  static midiNumberToFrequency(midiNumber) {
    return Math.pow(2, (midiNumber - 69) / 12) * 440;
  }

  static noteNameToFrequency(note) {
    const midiNumber = noteNameToMidiNumber(note);
    return midiNumberToFrequency(midiNumber);
  }
}

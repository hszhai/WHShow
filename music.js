class Music {
  static processedData = null; // Static variable to store processed data

  constructor(_json) {
    if (Music.processedData === null && _json) {
      // Process data only if it hasn't been processed before
      Music.processedData = Music.loadMusic(_json);
      console.log("Data processed and stored.");
    } else {
      console.log("Using previously processed data.");
    }
    this.midi = Music.processedData;
    console.log(this.midi);
  }

  static loadMusic(data) {
    let time_offset = 0;
    let speed_adjustment = 292 / 234;
    let processedData = [];
    Object.values(data).forEach((n, index) => {
      processedData.push({
        note: n.note,
        time: Math.floor((n.time * 1000 - time_offset) * speed_adjustment),
        duration: Math.floor(n.duration * 1000),
      });
    });
    return processedData;
  }

  notes_at(f, dur=0) {
    return this.midi.filter(note => note.time >= f && note.time <= f + dur);
  }

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
    const midiNumber = Music.noteNameToMidiNumber(note);
    return Music.midiNumberToFrequency(midiNumber);
  }

  calculateNoteStatistics() {
    const noteCounts = {};
    for (let noteData of this.midi) {
      let note = noteData.note;
      if (noteCounts[note]) {
        noteCounts[note]++;
      } else {
        noteCounts[note] = 1;
      }
    }
    return noteCounts;
  }
}

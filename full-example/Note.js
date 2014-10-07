/*
  A simple class to handle web audio stuff. Most of the synth characteristics
  are set in the builSynth function.

  More information on using the web audio API to make a synth
  https://developer.tizen.org/documentation/articles/advanced-web-audio-api-usage

*/

function Note(){
  this.filter;
  this.gain;
  this.osc;
  this.played = false;
  this.buildSynth();
}

Note.prototype.buildSynth = function(){
  this.osc = context.createOscillator();
  this.osc.type = 2; // sine (0), square (1), sawtooth (2), triangle (3)
  this.osc.frequency.value = 400; // Set the initial pitch, in HZ

  /* Filtering */
  this.filter = context.createBiquadFilter();
  this.filter.type = 0;
  this.filter.frequency.value = 440;

  /* Volume */
  this.gain = context.createGain();
  this.gain.gain.value = 0;


  /* Connect everything together */
  this.osc.connect(this.filter); // Connect sound to output
  this.filter.connect(this.gain);
  this.gain.connect(context.destination);
}

Note.prototype.setPitch = function(p){
  this.osc.frequency.value = p;
}

Note.prototype.setFilter = function(f){
  this.filter.frequency.value = f;
}

Note.prototype.setVolume= function(v){
  this.gain.gain.value = v;
}


/*

  Playing and stopping is done by turning the volume on and off for the oscillator.

*/
Note.prototype.play = function(){
  if(!this.played){
    this.osc.noteOn(0); // Play instantly
  }

  this.played = true;
  this.setVolume(0.5);
  return false;
}

Note.prototype.stop = function(){
  this.setVolume(0);
  return false;
}


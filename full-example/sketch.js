/*

  In this script we'll be using
    + p5 to draw visuals and get touch events
    http://p5js.org/reference/

    + the web audio API to generate sounds.
    This is mostly contained in the Note.js script
    http://www.html5rocks.com/en/tutorials/webaudio/intro/

    + the browser accelerometer API to get motion
    https://developer.mozilla.org/en-US/docs/Web/Events/devicemotion

    + websockets to talk to the server
    http://socket.io/docs/

*/


/*
    These are a few global variables for the sketch
*/

var posX, posY; // x and y position when you touch the screen
var acceleration; // for device motion
var isPressed = false; // is the screen pressed or not
var width = 800; // width of the canvas for visuals
var height = 800; // height of the canvas for visuals
var synth;
var socket = io.connect('http://'+window.location.hostname);
var timemsg = new Date().getTime(); // for timing


socket.on('connect', function(){
  console.log('connected');
});


/*
  This is a sketch function which p5 takes. It consists of a 'setup' and 'draw' function.
  'setup' runs once.  'draw' runs over and over.

*/
var sketch = function(s){
  /*
    The sketch takes an object s.  This contains all of the methods available in p5.
    Whenever we use a method in p5 here, it will have an 's.' before it.

    You can see the full list of methods here: p5js.org/reference/
  */

  /* Setup runs once */
  s.setup = function(){

    /* Creates a canvas on which everything is drawn.
       width and height determine the size. You can change these
    */
    s.createCanvas(width, height);

    /*
       the color space HSB is more intuitive in my opinion than RGB.
       H is for Hue, it goes from 0 to 255 and runs through the color spectrum.
       S is Saturation, 0 to 255
       B is Brightness, 0 to 255
   */
    s.colorMode("hsb");

    synth = new Note(); // From the Note.js script
    synth.setPitch(440);


    /*
       This starts reading the accelerometer data and running the deviceMotionHandler function
       when new data is received
    */

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', deviceMotionHandler, false);
    }

    if (window.DeviceOrientationEvent) {
      //  window.addEventListener('deviceorientation', devOrientHandler, false);
    }
  }


  /* Draw loops over and over after setup runs */
  s.draw = function(){
    s.background(0);

    /*
       Desktop has mouseX, phone has touchX
       This normalizes
    */
    posX = Math.max(s.mouseX, s.touchX);
    posY = Math.max(s.mouseY, s.touchY);


    if(isPressed){
      gesture(s);
    }
    else
    {

      for(var i=0; i<width; i+=10){
        s.stroke(255,0,255);
        s.strokeWeight(4);
        s.line(i,0, posX, posY);
      }

      for(var i=0; i<width; i+=10){
        s.stroke(255,0,255);
        s.strokeWeight(4);
        s.line(i,height, posX, posY);
      }

    }



    if(!acceleration){acceleration=0;}

    $("#content").text("X: " +posX + ", Y: " + posY +", a:"+acceleration.toFixed(2));

    //every 200 ms emit message
    var now = new Date().getTime();
    if(isPressed && (now - timemsg > 100)){
      socket.emit('motion',{x: posX, y: posY});
      timemsg = new Date().getTime();
    }
  }

  //start
  s.touchStarted  = s.mousePressed = function(){
    isPressed = true;
    synth.play();
  }

  //during
  s.touchMoved = s.mouseDragged =  function(){
    isPressed = true;
  }

  //end
  s.touchEnded = s.mouseReleased = function(){
    isPressed = false
    synth.stop();
  }


  deviceMotionHandler = function(accel){
    acceleration = accel.accelerationIncludingGravity.x;
    var aval = Math.abs(acceleration);
    if (isPressed && aval >5){
      s.background(aval/20 * 255, 255, 255);
    }
  }
}


function gesture(s){
  //by x position
  var c = posX/width * 255;

  //by y position
  var l = (1- posY/height) * 255;
  s.fill(c,255,l);
  s.ellipse(posX, posY, 100, 100);
  synth.setPitch(110 + posX/width*400);
  synth.setFilter(110 + posY/width*400);

  //rays
  for(var i=0; i<width; i+=10){
    s.stroke(c,255,l);
    s.strokeWeight(4);
    s.line(i,0, posX, posY);
  }

  for(var i=0; i<width; i+=10){
    s.stroke(c,255,l);
    s.strokeWeight(4);
    s.line(i,height, posX, posY);
  }
}

var checkFeatureSupport = function(){
  try{
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch (err){
    alert('web audio not supported');
  }
}


/*
  This runs after everything loads
*/

window.onload = function(){
  checkFeatureSupport();

  /*
     Retrieve the canvas created in index.html and
     set it as the p5 target
  */
  containerNode = document.getElementById( 'canvas' );
  myp5 = new p5(sketch, containerNode);
}



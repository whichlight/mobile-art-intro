/*
  This is the basic example, it is boilerplate for getting started with the workshop

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
 Global Variables
*/

var posX, posY; // x and y position when you touch the screen
var acceleration; // for device motion
/*

*/
var isPressed = false; // is the screen pressed or not
var width = 640; // width of the canvas for visuals
var height = 640; // height of the canvas for visuals
var socket = io.connect('http://'+window.location.hostname);
/*
  To write to the server
  socket.emit('motion',{data: x });
*/

var timemsg = new Date().getTime(); // for timing


var synth;
/*
  This is the variable for the synth, as specified in Note.js
  usage is

  synth = new Note(); // creates the synth object
  synth.setPitch(440);
  synth.setFilter(440);
  synth.play();
  synth.stop();

*/

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

    /*
    Do the fun drawing stuff here!
    */

    if(isPressed){
      gesture(s);
    }
    else
    {


    }



    if(!acceleration){acceleration=0;}

    $("#content").text("X: " +posX + ", Y: " + posY +", a:"+acceleration.toFixed(2) + ", pressed:"+ isPressed);

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
  }

  //during
  s.touchMoved = s.mouseDragged =  function(){
    isPressed = true;
  }

  //end
  s.touchEnded = s.mouseReleased = function(){
    isPressed = false
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



# Interactive Visuals and Sounds in the Browser

This is a workshop using the web audio api, device motion api, p5, websockets, and the serial port to make fun interactive after with the phone.

You can find the complete example in 'full-example', and a place to get started under 'basic-example'

## Installation

Clone this repo, and make sure you have installed NPM and node. During the workshop we'll use a few  node modules which may require additional installation: node serialport and socketio.

## Fun Examples

To get an idea of what you can make with these technologies let's run a few examples.

+ Open this up on your phone http://whichlight.github.io/mobile-synth-test/
+ Open this up on your phone: http://whichlight.github.io/arty-party-synth/
+ Open this up on your computer http://cell-flight.com/mural.html and this on your phone http://cell-flight.com/
+ Open this up on your phone http://danceydots.com

## Intro

This gives you everything in p5. We'll start here. Start a local server with node-static in the folder and go to http://localhost:8080/empty-example/. You won't see anything. Let's get started.

###Drawing

Throw this code under the `setup` function

```
line(30,20,85,75);
```
Refresh the page. You'll have a line! Here is the reference for lines: http://p5js.org/reference/#/p5/line. Go there to see what the arguments are. Change the arguments.

Add `stroke` just before the `line` function

```
stroke(200);
line(30,20,85,75);
```

Now change stroke, give it three number from 0-255.

```
stroke(200,100,10);
line(30,20,85,75);

```
This is in RGB. Let's change to HSB colorspace. Go to the reference for p5 http://p5js.org/reference/.  There is a colorMode function which can change this for us.

```
colorMode(HSB);
stroke(100,255,255);
line(30,20,85,75);
```
The line is a bit thin. Let's make it thicker.  `strokeWeight` handles this for us. http://p5js.org/reference/#/p5/strokeWeight

```
colorMode(HSB);
stroke(100,255,255);
strokeWeight(5);
line(30,20,85,75);
```

The canvas is a bit small. Let's make it bigger. Let's also color the background black.

```
createCanvas(640,640);
background(0,0,0);
```
Now make the line start from the center.
Let's make more lines.  So they fan outward from the center.
Replace the line code with this:

```
  var len = 50;

  for(var i = 0; i<360; i+=10){
    rad = i * (PI/180);
    x = len * cos(rad);
    y = len * sin(rad);

    colorMode(HSB);
    stroke(100,255,255);
    strokeWeight(5);
    line(width/2,height/2,width/2+x,height/2+y);
  }
```

Play around with that.  Change the colors too.
Now let's make it interactive. Move the block of code that renders into the `draw` function. This includes the `background` call and the loop.

Now you have

```
function setup() {
  // put setup code here
  createCanvas(640,640);
  colorMode(HSB);
  background(0,0,0);

}

function draw() {
  // put drawing code here

  background(0,0,0);
  var len = 50;

  for(var i = 0; i<360; i+=10){
    rad = i * (PI/180);
    x = len * cos(rad);
    y = len * sin(rad);

    stroke(100,255,255);
    strokeWeight(5);
    line(width/2,height/2,width/2+x,height/2+y);
  }
}
```
Change the `line` function call to have mouseX and mouseY as the first two arguments. THis changes where the lines begin to be where the mouse cursor is.

```
 line(mouseX,mouseY,width/2+x,height/2+y);
```

Change the color of the lines based on where the mouse is. We will use the `map` function.

```
col = map(mouseX, 0, width, 0, 255);
stroke(col,255,255);
```

We can get mouse position, now lets detect a touch event. When the mouse is pressed, we'll color things red.
```
  if(mouseIsPressed){
    col = 0;
  }
```

Go the the ```index.html``` file and uncomment ```p5.sound.js```. You can learn more about p5 sound here: http://p5js.org/reference/#/libraries/p5.sound.

Create a synth sound by adding this in the `setup` function:

```
  pulse = new p5.Pulse();
  pulse.amp(0);
  pulse.freq(220);
  pulse.start();

```
Now in `draw` map the x position to a frequency
```
  var f = map(mouseX, 0,width, 10,2000);
  pulse.freq(f);
```

And when the mouse is pressed, turn the volume up.

```
  pulse.amp(0);
  if(mouseIsPressed){
    col = 0;
    pulse.amp(0.8);
  }
```

Great! You just learned a ton :)

## Boilerplate

Now we're going to move into more mobile stuff. This requires some boilerplate to handle edge cases. You can grab some boilerplate under the 'basic-example' folder. This contains some code for p5, touch events, and a few variables we'll use during the workshop.

To run this, you first need to install a few things. Go to the `basic-example` folder and run

```
npm install node-static
npm install socket.io
npm install serialport
```

We'll first walk through the code. Note `index.html`, `server.js`, `Note.js`, and `sketch.js`.

Hop into `basic-example/sketch.js`. run `node server.js` and open up the browser on port 8000. Run `ifconfig` in your terminal and note the local IP address.  This is the address you can open up on your phone browser to see the example there too.

When you run the example, you will see a blank canvas with a few values written below. This shows the touch and accelerometer data.

### Data values

The function below fills the `#content` div with data values to display. You can change this to specify specific things.
```
$("#content").text("X: " +posX + ", Y: " + posY +", a:"+acceleration.toFixed(2) + ", pressed:"+ isPressed);
```

### Assigning a target to p5

Looking at `basic-example/sketch.js`. First of all, note that the p5 methods are prepended with `s.`. This is because we have an object now that contains all of the methods. Before they were in the global scope. Now it is in the object, this had to do with moving to mobile. Note that p5 is assigned to a target canvas too, instead of creating one as we did before.

### Visuals

Visuals are just as before, using p5. You can specify them in the `draw` function.

### Coordinates
You'll see `posX` and `posY`. That normalizes the mouse and touch coordinates.  If you do something with those variables it will work on mobile and desktop.

### Sound
This is for web audio. Note a few calls mentioned in the comments to change pitch, filter, volume, play, and pause.

### Accelerometer
You can access this in the `deviceMotionHandler` function. The `accel` object contains the accelerometer data, which is moved to the global scope by assigning it to the `accelerometer` variable.

Example data you can get from it:

```
var x = accel.accelerationIncludingGravity.x;
var y = accel.accelerationIncludingGravity.y;
var z = accel.accelerationIncludingGravity.z;
```

### Socket
This writes to the server. You can see the `emit` method. Whatever data you send will be accessible on the server and written to serial. This can be coordinates, acceloremeter, or isPressed data.


## Time to Play!

Pick one of the input values and map a sound to it.  Create visuals for it.  Explore different patterns based on what you learned in the p5 intro. See how it feels on the phone. Have fun!

## Next steps

You can specify what data to send to serial. This will be read by the Arduino in the next stages and used to program lights.

## Thanks!!

You can reach me at `@whichlight` on twitter.


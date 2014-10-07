


function setup() {
  // put setup code here
  createCanvas(640,640);
  colorMode(HSB);
  background(0,0,0);

  pulse = new p5.Pulse();
  pulse.amp(0);
  pulse.freq(220);
  pulse.start();

}

function draw() {
  // put drawing code here

  background(0,0,0);

  var len = 50;
  var col = map(mouseX, 0, width, 0, 255);


  pulse.amp(0);
  if(mouseIsPressed){
    col = 0;
    pulse.amp(0.8);
  }

  var f = map(mouseX, 0,width, 10,2000);
  pulse.freq(f);

  for(var i = 0; i<360; i+=10){
    rad = i * (PI/180);
    x = len * cos(rad);
    y = len * sin(rad);
    stroke(col,255,255);
    strokeWeight(5);
    line(mouseX,mouseY,width/2+x,height/2+y);
  }

}

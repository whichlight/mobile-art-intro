/*
  This is a small nodejs server for
    + serving the web application
    + client to server communication via websockets
    + writing to a serial port
*/

/*
   module for a simple server
   https://github.com/cloudhead/node-static
*/

var server = require('node-static');
var fileServer = new server.Server(__dirname);

/*
  module for working with the serial port
  https://github.com/voodootikigod/node-serialport

*/
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;


/*
  Set the parameters for the serial port based on what
  the settings are on the Arduino. This parses via newline
*/

/*
var serialPort = new SerialPort("/dev/tty.usbmodem1421", {
      baudrate: 9600,
      parser: serialport.parsers.readline("\n")
});

serialPort.on("open", function () {
    console.log('open');
});
*/


/*
  This is the simple file server, listening on 8000
*/

var app = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(8000);

/*
  Include socket IO for websockets
*/

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  socket.emit('id',socket.id);

  /*
    In the client the data is written under the event 'motion'
    So we listen to it here under the event 'motion'
  */

  socket.on('motion', function (data) {

    // Data is logged to the console
    console.log(data);

    /*
      When data is read from the socket, it is written to the serial port
    */

    /*
    serialPort.write(data, function(err, res){
      if (err) console.log('err '+err);
    });
    */

  });
});



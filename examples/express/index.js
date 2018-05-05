const app = require('express')(),
http = require('http').Server(app),
io = require('socket.io')(http),
slr = require('socketio-live-reload'),
port = 8080;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var watchFiles = ["./css/style.css","./js/app.js"];
// watch options
var watchOptions = {
  ignored: [],
  interval: 100,
  depth: 99
}

io.on('connection', function (socket) {
  //start socketio-live-reload on connection.
  slr.init(socket,watchFiles,watchOptions)
});

http.listen(port, function(){
  console.log('listening on port:' + port);
});

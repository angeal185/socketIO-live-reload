const app = require('http').createServer(handler),
io = require('socket.io')(app),
fs = require('fs'),
slr = require('socketIO-live-reload'),
chalk = require('chalk');
app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

// files to be watched
var watchFiles = ["./css/style.css","./js/app.js"];
// watch options
var watchOptions = {
  ignored: [
    "*.txt",
    "*.md"
  ],
  interval: 100,
  depth: 99
}

io.on('connection', function (socket) {
  //start socketIO-live-reload on connection.
  slr.init(socket,watchFiles,watchOptions)
});

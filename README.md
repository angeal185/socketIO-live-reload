# socketIO-live-reload
in browser live reload using socketIO

### Installation

npm:
```sh
$ npm install socketio-live-reload --save-dev
```

### info

in browser live reload using socketIO.

### API

#### server-side

```js

const slr = require('socketIO-live-reload');

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

```

#### client-side

```html

<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
  socket.on('reload', function(){
    location.reload();
  });
</script>

```

### Basic example

#### server-side

```js
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

```

#### client-side

```html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();
      socket.on('reload', function(){
        location.reload();
      });
    </script>
  </body>
</html>
```

* examples can be found in `./lib/examples`

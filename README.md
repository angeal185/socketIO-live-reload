# socketIO-live-reload
in browser live reload using socketIO

### Installation

npm:
```sh
$ npm install socketio-live-reload --save-dev
```

### info

in browser live reload using socketIO.

### Instructions

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

* examples can be found in `./lib/examples`

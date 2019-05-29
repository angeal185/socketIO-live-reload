# socketio-live-reload
in browser live reload using socketIO

### Installation

npm:
```sh
$ npm install socketio-live-reload --save-dev
```


### API

#### server-side

```js

// defaults ~ created in your cwd automatically on
// first run and can be edited in ./SLR.json

{
  "server":{ // slr server config
    "port": 8888
  },
  "watch": ["./*"], //watched files
  "options": {
    "ignored": [ //ignored files
      "./node_modules/*"
    ],
    "interval": 100,
    "depth": 99,
    "ignoreInitial": false,
    "followSymlinks": true,
    "cwd": "./",
    "disableGlobbing": false,
    "usePolling": true,
    "binaryInterval": 300,
    "alwaysStat": false,
    "awaitWriteFinish": {
      "stabilityThreshold": 2000,
      "pollInterval": 100
    },
    "ignorePermissionErrors": false,
    "atomic": 100
  },
  "io": { //socket.io options
    "pingInterval": 10000,
    "pingTimeout": 5000,
    "transports": [
      "polling",
      "websocket"
    ]
  }
}

//demo
const slr = require('socketio-live-reload');

slr.init();

```

#### client-side


```js
//defaults

{
  port: 8888, // socket.io server port
  URL: 'http://localhost', // socket.io server url
  reload: true, // auto reload enabled
  reloadTime: 1000, // time before reload
  debug: true //debug toolbar
}


/**
 *  sync ~ init SLR
 *  @param {object} config ~ optional client side config
 *  @param {function} cb ~ optional callback
 **/

slr.init(config, cb)

```


```html

<!-- DEMO -->

<!-- load styles if using debug toolbar -->
<link rel="stylesheet" href="//localhost:8888/SLR.css">



<!-- pre-packed with socket.io slim-->
<script src="//localhost:8888/SLR_full.js"></script>


<!-- or to load socket.io seperate -->
<script src="//localhost:8888/socket.io/socket.io.slim.js"></script>
<script src="//localhost:8888/slr.js"></script>

<!-- init SLR with default options-->
<script>slr.init()</script>
```

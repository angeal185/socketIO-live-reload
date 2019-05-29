const http = require('http'),
fs = require('fs'),
chokidar = require('chokidar'),
os = require('os'),
path = require('path'),
chalk = require('chalk'),
cversion = require('../package').version;


const cl = console.log,
cc = chalk.cyanBright,
cg = chalk.greenBright,
cm = chalk.magentaBright;

let cpu = new process.cpuUsage();


function c2(i){
  cl(cg('[SLR]: ',cc(i)));
}

function c3(i,e){
  cl(cg('[SLR]: ',cc(i + ' ',cm(JSON.stringify(e)))));
}

module.exports = function(){

  function init(srv, files, options, iocnf){
    const server = require('http').createServer(function (req, res) {

      let item = req.url,
      ct;

      if(req.url !== '/'){
        fs.readFile(__dirname.slice(0,-3) + 'client' + item, function (err,data) {
          if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
          }
          if(path.extname(item) === '.css'){
            ct = 'text/css'
          }
          if(path.extname(item) === '.js'){
            ct = 'application/javascript'
          }

          res.writeHead(200, {
            'Content-Length': Buffer.byteLength(data),
            'Content-Type': ct,
            'Cache-Control': srv.cache
          });

          res.end(data);
        });
      } else {
        res.end(JSON.stringify({
          server: srv,
          files: files,
          options: options,
          io: iocnf
        },0,2));
      }

    });

    const io = require('socket.io')(server, {
      serveClient: true,
      pingInterval: iocnf.pingInterval,
      pingTimeout: iocnf.pingTimeout,
      allowUpgrades: true,
      transports: iocnf.transports,
      origins: iocnf.origins,
      cookie: 'SLR'
    });

    server.listen(srv.port);

    let watching = {
      files: 0,
      dirs: 0
    }

    for (let i = 0; i < files.length; i++) {
      if(files[i].charAt(files[i].length -1) === '*'){
        watching.dirs++
      } else{
        watching.files++
      }
    }

    //cl(watching)

    c2('listening on port: ' + srv.port);

    io.on('connection', function (socket) {
      c2('connected');
      var watcher = chokidar.watch(files,options)
        .on('ready', function(){
          //log init details to console
          c2('starting...');
          c3('watching', files);
          c3('ignored', options.ignored);
        })
        .on('change', (event, path) => {
          //log change event to console
          c2('change detected in file ' + event + '. updating browser...');
          // clear events
          watcher.close();
          socket.emit('reload', event);
        });

        socket.on('discon', function(i) {
          cl('disconnecting')
          socket.disconnect(true);
        });

        socket.on('recon', function(i) {
          socket.disconnect(true)
        });

        socket.on('live-data', function(i) {
          liveData
        });

        socket.on('stop-data', function(i) {
          clearInterval(liveData)
        });

      // start socketio-live-reload on connection.

      socket.emit('slr-details', {
        version:cversion,
        user: os.userInfo().username,
        pid:process.pid,
        platform: process.platform,
        files: watching.files,
        dirs: watching.dirs,
        ignored: options.ignored.length
      });

      let liveData = setInterval(function(){
        socket.emit('slr-specs', {
          cpu: cpu.user + cpu.system,
          memory:process.memoryUsage().rss
        });
      },5000)

    });
  }

  let config;

  try {
    config = JSON.parse(fs.readFileSync('./SLR.json'));
    init(config.server, config.watch, config.options, config.io);
    c2('client config found, starting...');
  } catch (err) {
    c2('config does not exist, creating...');
    fs.copyFile(__dirname.slice(0,-3) + 'SLR.json', './SLR.json', (err) => {
      if (err) throw err;
      c2('client config created, starting...');
      config = JSON.parse(fs.readFileSync('./SLR.json'));
      init(config.server, config.watch, config.options, config.io);
    });
  }

}

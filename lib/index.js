const fs = require('fs'),
chokidar = require('chokidar'),
chalk = require('chalk');

exports.init = function(socket,files,options){
  var watcher = chokidar.watch(files,options)
    .on('ready', function(){
      //log init details to console
      console.log(chalk.greenBright('[socketIO:live-reload]',chalk.cyanBright('starting...')));
      console.log(chalk.greenBright('[socketIO:live-reload]',chalk.cyanBright('watching:',chalk.magentaBright(JSON.stringify(files)))));
      console.log(chalk.greenBright('[socketIO:live-reload]',chalk.cyanBright('ignored:',chalk.magentaBright(JSON.stringify(options.ignored)))));
    })
    .on('change', (event, path) => {
      //log change event to console
      console.log(
        chalk.greenBright('[socketIO:live-reload]',
        chalk.cyanBright('change detected in file:',
        chalk.magentaBright(event)+'. updating browser...')));
      // clear events
      watcher.close();
      //reload browser
      socket.emit('reload');
    });
}

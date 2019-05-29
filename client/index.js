
function SLR(){

  const ls = {
    get: function(i){
      return JSON.parse(localStorage.getItem(i))
    },
    set: function(i,e){
      localStorage.setItem(i, JSON.stringify(e))
    }
  },
  ss = {
    get: function(i){
      return JSON.parse(sessionStorage.getItem(i))
    },
    set: function(i,e){
      sessionStorage.setItem(i, JSON.stringify(e))
    }
  },
  $$ = document;

  function rl(i){
    setTimeout(function(){
      location.reload()
    }, i)
  }

  function evt(i, e, cb){
    ct(i).addEventListener(e, function(x){
      cb(x)
    });
  }

  function loadToolbar(cfg, cb){
    try {

      let toolbarTpl = '<div class="slr_toolbar fadeInLeft"><div class="slr-tbh"><h2 class="blink slr-ttl">'+cfg.title+'</h2><small class="slr-sub blink">'+cfg.sub+'<small></div><div class="slr_toolbarBody"></div></div>',
      slrTpl = '<div class="slr-conf"></div><div class="slr-devBar cont"><div class="slr_row"><div class="slr_col-6 slr-left"><span class="slr-menu"><i class="icono-tiles"></i></span><span class="slr-txt"></span></div><div class="slr_col-6 slr-right"></div></div></div>',
      res, stat, sel;

      html('body', toolbarTpl);
      html('body', slrTpl);

      ['disconnect', 'reload'].forEach(function(i){
        append('.slr-right', el('button', {type: 'button', id: 'slr_' +i, class: 'slr-btn'}, i));
      })

      sel = cfg.items;

      sel.forEach(function(i) {
        res = '<div class="slr_toolbarItem">'+i+': <span class="slr_toolbarRes blink slr_'+ i +'"></span></div>';
        html('.slr_toolbarBody', res)
      });

      if(cfg.staus){
        stat = 'connected';
      } else {
        stat = 'disconnected';
      }

      res = '<div class="slr_toolbarItem">Status: <span class="slr_toolbarRes blink status">'+ stat +'</span></div>';

      html('.slr_toolbarBody', res)
      cb(false, cfg)
    } catch (err) {
      cb(err, null)
    }

    conText('connecting...', 'orange');
  }

  function textI(i,e){
    $$.getElementById(i).appendChild(
      $$.createTextNode(e)
    );
  }

  function html(i,e){
    ct(i).innerHTML += e;
  }

  function attr(item, attr){
    if(attr && typeof attr === 'object'){
     for (var i in attr) {
        ct(item).setAttribute(i, attr[i]);
      }
    }
  }

  function css(item, attr){
    if(attr && typeof attr === 'object'){
     for (var i in attr) {
        ct(item).style[i] = attr[i];
      }
    }
  }

  function htmlR(i,e){
    ct(i).innerHTML = e;
  }

  function append(i,e){
    ct(i).appendChild(e)
  }

  function ct(i){
    let type = i.charAt(0),
    item;
    if(type === '#'){
      item = $$.getElementById(i.substring(1))
    } else if(type === '.'){
      item = $$.getElementsByClassName(i.substring(1))[0]
    } else {
      item = $$.getElementsByTagName(i)[0]
    }
    return item
  }

  function el(type, attr, text) {
    let ele = $$.createElement(type);
    if(attr && typeof attr === 'object'){
     for (var i in attr) {
        ele.setAttribute(i, attr[i]);
      }
    }
    if(text && typeof text === 'string' || !text && typeof attr === 'string'){
      ele.appendChild(
        $$.createTextNode(text)
      );
    }
    return ele;
  }

  function conText(text, color){
    let cItems = ['.slr-txt', '.status']
    cItems.forEach(function(i){
      htmlR(i, text);
      css(i, {color:color});
    })
  }



  return {
    init: function(config, cb){
      if(typeof config === 'function'){
        cb = config;
        config = {};
      }
      if(!config){
        config = {};
      }

      const defaults = {
        port: config.port || '8888',
        URL: config.url  || 'http://localhost',
        reload: config.reload || true,
        reloadTime: config.reloadTime || 1000,
        debug: config.debugBar || true
      },
      obj = {
        title: 'SLR',
        sub: 'socketio live reload',
        status: 1,
        items: [
          'cpu',
          'memory',
          'user',
          'session',
          'platform',
          'pid',
          'version',
          'files',
          'dirs',
          'ignored'
        ]
      },
      count = 0;

      ss.set('slr-count', 0);

      const socket = io([defaults.URL,  defaults.port].join(':'));

      if(defaults.debug){

        loadToolbar(obj, function(err, data){
          if(err){return console.log(err)}

          socket.on('connect', function (socket) {
            console.log('SLR connected');
            conText('connected', 'lime');
          });

          socket.on('slr-details', function(i){
            Object.keys(i).forEach(function(val) {
              htmlR('.slr_' + val, i[val]);
            });
          });

          let sessTime = setInterval(function(){
            ss.set('slr-count', ss.get('slr-count') + 1)
            htmlR('.slr_session', ss.get('slr-count') + 's')
          },1000);

          socket.on('connect', function (socket) {
              sessTime;
          });

          socket.on('slr-specs', function(i){
            Object.keys(i).forEach(function(val) {
              htmlR('.slr_' + val, i[val]);
            });
          });

          socket.on('disconnect', function (socket) {
            clearInterval(sessTime);
            conText('disconnected', 'red')
          });

          socket.on('reconnecting', function (socket) {
            conText('reconnecting...', 'orange')
          });

          socket.on('reload', function(i){
            let msg = 'change detected in '+ i +'. reloading...';
            console.log(msg)
            conText(msg, 'orange');
          });

          evt('#slr_disconnect', 'click', function(){
            socket.emit('discon');
            clearInterval(sessTime);
            conText('disconnected', 'red')
            console.log('SLR disconnected');
          });

          evt('#slr_reload', 'click', function(){
            rl(defaults.reloadTime);
            conText('reloading...', 'orange');
            console.log('SLR reloading');
          });

          evt('.slr-menu', 'click', function(){
            rl(defaults.reloadTime);
            conText('reloading...', 'orange');
            console.log('SLR reloading');
          });

          socket.emit('live-data');

        });

      }

      socket.on('reload', function(i){
        setTimeout(function(){
          location.reload();
        },3000)
      });

      if(cb){
        cb(defaults);
      }
    }
  }
}

const slr = new SLR();

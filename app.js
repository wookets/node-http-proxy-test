var http = require('http');
var httpProxy = require('http-proxy');


var proxy = httpProxy.createProxyServer();

// Error handler
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end('Something went wrong. And we are reporting a custom error message.');
});

//
// Create your server that make an operation that take a while
// and then proxy de request
//
http.createServer(function (req, res) {
  console.log('incoming req', req);
  if(req.url === '/app1') {
    proxy.web(req, res, {
      target: 'http://localhost:9001'
    });
  }
  else if (req.url === '/app2') {
    proxy.web(req, res, {
      target: 'http://localhost:9002'
    });
  }
  else {
    res.write('No proxy');
    res.end();
  }
}).listen(8000);



// APP SERVER 1
http.createServer(function (req, res) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.write('APP1: request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9001);

// APP SERVER 2
http.createServer(function (req, res) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.write('APP2: request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9002);
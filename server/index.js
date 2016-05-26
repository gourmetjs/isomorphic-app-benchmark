"use strict";

var npath = require("path");
var http = require("http");
var initApp = require("./app");

var port = process.env.NODE_ENV === "production" ? 80 : 3000;

// Event listener for HTTP server "error" event.
function _onError(err) {
  if (err.syscall !== "listen") {
    throw err;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (err.code) {
    case "EACCES":
      throw Error(bind + " requires elevated privileges");
    case "EADDRINUSE":
      throw Error(bind + " is already in use");
    default:
      throw err;
  }
}

// Event listener for HTTP server "listening" event.
function _onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}

var app = initApp({
  apiUrl: "http://localhost:" + port,
  enableCache: false
});

var server = http.createServer(app);

server.listen(port);
server.on("error", _onError);
server.on("listening", _onListening);

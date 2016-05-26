"use strict";

var npath = require("path");
var http = require("http");
var app = require("./app");

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

var server = http.createServer(app);

server.listen(3000);
server.on("error", _onError);
server.on("listening", _onListening);

"use strict";

var npath = require("path");
var express = require("express");
var logger = require("morgan");
var ReactDOMServer = require("react-dom/server");
var renderRoot = require("../_build/server/renderRoot").default;

var app = express();

// view engine setup
app.set("views", npath.join(__dirname, "templates"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use("/static/scripts", express.static(npath.join(__dirname, "../_build/client")));
app.use("/static", express.static(npath.join(__dirname, "../static")));

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/client", function(req, res) {
  res.render("base", {
    title: "Client rendering",
    contentElements: ""
  });
});

app.get("/isomorphic", function(req, res) {
  renderRoot(function(component) {
    res.render("base", {
      title: "Isomorphic rendering",
      contentElements: ReactDOMServer.renderToString(component)
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  err.code = "NOT_FOUND";
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: app.get("env") !== "development" ? {} : err
  });
});

module.exports = app;

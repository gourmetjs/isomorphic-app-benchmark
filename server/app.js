"use strict";

var npath = require("path");
var fs = require("fs");
var express = require("express");
var logger = require("morgan");
var ReactDOMServer = require("react-dom/server");
var fetch = require("node-fetch");
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
    title: "Client Rendering",
    data: "null",
    contentElements: '<div class="app-loading"><i class="fa fa-refresh fa-spin fa-5x fa-fw"></i></div>'
  });
});

app.get("/isomorphic", function(req, res, next) {
  renderRoot({
    loadData: function() {
      return fetch("http://localhost:3000/data").then(function(res) {
        return res.json();
      }).catch(function(err) {
        next(err);
        throw err;
      });
    },

    render: function(component, data) {
      res.render("base", {
        title: "Isomorphic Rendering",
        data: JSON.stringify(data),
        contentElements: ReactDOMServer.renderToString(component)
      });
    }
  });
});

app.get("/data", function(req, res, next) {
  fs.readFile(npath.join(__dirname, "data.json"), "utf8", function(err, data) {
    if (err) {
      next(err);
    } else {
      data = JSON.parse(data);
      res.json(data);
    }
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

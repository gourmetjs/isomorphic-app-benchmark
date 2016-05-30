"use strict";

var npath = require("path");
var fs = require("fs");
var express = require("express");
var logger = require("morgan");
var compression = require("compression");
var ReactDOMServer = require("react-dom/server");
var renderRoot = require("../_build/server/renderRoot").default;
var wines = require("./data.json");

module.exports = function(options) {
  var app = express();

  // view engine setup
  app.set("views", npath.join(__dirname, "templates"));
  app.set("view engine", "ejs");

  // generic middleware setup
  app.use(logger("dev"));
  app.use(compression());

  // static middleware setup
  var staticOptions = options.longTermCache ? {maxage: 24 * 60 * 60 * 1000} : undefined;
  app.use("/static/scripts", express.static(npath.join(__dirname, "../_build/client"), staticOptions));
  app.use("/static", express.static(npath.join(__dirname, "../static"), staticOptions));
  app.use("/static/vendors", express.static(npath.join(__dirname, "../node_modules"), staticOptions));

  // index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  // server: send HTML without data and content markups
  // client: request data via API (200ms delay) -> render content markups with the data
  app.get("/client", function(req, res) {
    res.render("base", {
      title: "Client Rendering",
      data: "null",
      contentElements: '<div class="app-loading"><i class="fa fa-refresh fa-spin fa-5x fa-fw"></i></div>'
    });
  });

  // server: get data (200ms delay) -> send HTML with data and pre-rendered markups
  // client: render content markups with the data and verify (reconsiliation)
  app.get("/isomorphic", function(req, res, next) {
    renderRoot({
      loadData: function() {
        return new Promise(function(resolve) {
          setTimeout(function() {
            resolve(wines);
          }, options.dataDelay);
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

  // server: get data (200ms delay) -> send HTML with data only (no pre-rendered markups)
  // client: render content markups with the data
  app.get("/client-no-ajax", function(req, res) {
    setTimeout(function() {
      res.render("base", {
        title: "Client Rendering without AJAX",
        data: JSON.stringify(wines),
        contentElements: ""
      });
    }, options.dataDelay);
  });

  // Data API for client rendering
  app.get("/data", function(req, res, next) {
    setTimeout(function() {
      res.json(wines);
    }, options.dataDelay);
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

  return app;
};

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

  if (!options.enableCache) {
    app.disable("etag");
  }

  var staticOptions = {
    etag: options.enableCache,
    lastModified: options.enableCache
  };

  app.use(logger("dev"));
  app.use(compression());
  app.use("/static/scripts", express.static(npath.join(__dirname, "../_build/client"), staticOptions));
  app.use("/static", express.static(npath.join(__dirname, "../static"), staticOptions));
  app.use("/static/vendors", express.static(npath.join(__dirname, "../node_modules"), staticOptions));

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

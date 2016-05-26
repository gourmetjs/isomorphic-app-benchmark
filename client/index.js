import React from "react";
import ReactDOM from "react-dom";
import renderRoot from "../src/renderRoot";

renderRoot(function(component) {
  ReactDOM.render(component, document.getElementById("content_container"));
});

import React from "react";
import ReactDOM from "react-dom";
import "whatwg-fetch";
import renderRoot from "../src/renderRoot";

renderRoot({
  loadData() {
    if (window.__initialData__) {
      return Promise.resolve(window.__initialData__);
    } else {
      return fetch("/data").then(res => {
        return res.json();
      }).catch(err => {
        console.error(err);
      });
    }
  },

  render(component) {
    ReactDOM.render(component, document.getElementById("content_container"));
  }
});

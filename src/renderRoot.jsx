import React from "react";
import AppRoot from "./AppRoot";

export default function renderRoot(options) {
  options.loadData().then(data => {
    options.render(<AppRoot data={data}/>, data);
  });
}

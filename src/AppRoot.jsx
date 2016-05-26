import React, {Component} from "react";
import WineDetail from "./WineDetail";

export default class AppRoot extends Component {
  render() {
    return (
      <div>
        {this.props.data.map(wine => <WineDetail wine={wine} key={wine.id}/>)}
      </div>
    );
  }
}

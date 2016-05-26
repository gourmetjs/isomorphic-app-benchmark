import React, {Component} from "react";

function _replaceLineBreaks(text) {
  return {__html: text.replace("\n", "<br>")};
}

export default class WineDetail extends Component {
  render() {
    var wine = this.props.wine;
    return (
      <div className="wine-detail row">
        <div className="col-xs-2">
          <img className="wine-photo img-responsive" src={wine.photo} alt={wine.name}/>
        </div>
        <div className="col-xs-10">
          <h3>{wine.name}</h3>
          <p>
            <span className="label label-info">${wine.price}</span>
            {Object.keys(wine.acclaim).map(function(name) {
              var point = wine.acclaim[name];
              return (
                <span className="label label-default" style={{marginLeft: "0.5em"}} key={name}>
                  {name + " " + point}
                </span>
              );
            })}
          </p>
          <p dangerouslySetInnerHTML={_replaceLineBreaks(wine.note)}/>
        </div>
      </div>
    );
  }
}

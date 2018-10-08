import React, { Component } from "react";
import { GoogleApiWrapper } from "google-maps-react";
import { data_credentials } from "./data-api/data";
import Map from "./Map.js";
import "../App.css";

class App extends Component {
  render() {
    const { loaded } = this.props;
    return (
      <div className="App">
        {loaded ? (
          <Map google={this.props.google} />
        ) : (
          <div className="error-loading">
            <p className="error-msg">Couldn't load Google Maps</p>
          </div>
        )}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: data_credentials.MAP_KEY
})(App);

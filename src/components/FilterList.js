import React, { Component } from "react";
import "../index.css";
import ListItem from "./ListItem";

class Sidenav extends Component {
  // Eventhandler to handle the change of the dropdown option
  changeOption = event => {
    let choice = event.target.value;
    this.props.filter(choice);
    let locations = this.props.locations.filter(
      location => location.visible === true
    );
    this.setState({ locations });
  };

  render() {
    const { tips, map, infoWindow, markers, searchQuery } = this.props;
    return (
      <div className="filter">
        <select
          name="filter-options"
          tabIndex="1"
          id="filter-field"
          onChange={this.changeOption}
          defaultValue={searchQuery}
          aria-label="Filter markers by type"
        >
          <option value="all">All</option>
          <option value="restaurant">Restaurants</option>
          <option value="hospital">Hospitals</option>
          <option value="apartment">Apartments</option>
          <option value="hotel">Hotels</option>
          <option value="school">Schools</option>
        </select>

        <ul className="location-list">
          {markers.map(marker => (
            <ListItem
              map={map}
              tips={tips}
              marker={marker}
              key={marker.title}
              infoWindow={infoWindow}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default Sidenav;

import React, { Component } from "react";
import "../index.css";
import { data_credentials } from "./data-api/data";

class NavItem extends Component {
  openMarker = () => {
    const { tips, map, infoWindow, marker } = this.props;
    //  To get the corresponding venue details based on venue id
    let findVenueDetails = (title, tips) => {
      if (tips) {
        const venueId =
          data_credentials.places[
            data_credentials.places.findIndex(ele => ele.title === title)
          ].venue_id;
        return tips[tips.findIndex(tipDet => tipDet.id === venueId)];
      }
      return;
    };
    // Set the content to the info window of marker
    let venueDetails = findVenueDetails(marker.title, tips);
    map.panTo(marker.getPosition());
    infoWindow.setContent(
      `<div tabIndex="1" name=${marker.title}>
                <p>${marker.title}</p>
                <p>${venueDetails.location.address}, ${
        venueDetails.location.city
      } ${venueDetails.location.cc}</p>
                <p>${venueDetails.location.cc} Phone: ${
        venueDetails.contact.formattedPhone
      }</p>
                <p>Tip by <a tabIndex="1" href="https://foursquare.com/">FOURSQUARE</a></p>
            </div>`
    );
    // To add animation the marker
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(() => {
      marker.setAnimation(null);
    }, 800);
    infoWindow.open(map, marker);
  };

  render() {
    const { marker } = this.props;

    return (
      <li className="nav-item" tabIndex="2" onClick={this.openMarker}>
        <p>{marker.title}</p>
      </li>
    );
  }
}

export default NavItem;

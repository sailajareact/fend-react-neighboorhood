import React, { Component } from "react";
import "../index.css";
import Sidenav from "./FilterList";
import { data_credentials } from "./data-api/data";

class Map extends Component {
  state = {
    map: {},
    locations: data_credentials.places,
    infoWindow: {},
    markers: [],
    searchQuery: "all",
    tips: []
  };
  //function to filter based on type of location
  filter = searchQuery => {
    const map = this.state.map;
    const markers = this.state.markers;
    //clear map
    markers.forEach(marker => marker.setMap(null));

    const selectLocations = this.state.locations.map(location => {
      if (location.type === searchQuery || searchQuery === "all") {
        location.visible = true;
      } else {
        location.visible = false;
      }
      return location;
    });

    this.setState({ selectLocations, searchQuery });
    this.setMarkers(map);
  };

  componentDidMount() {
    this.loadMap(); // call loadMap function to load the google map
    let tips = [];
    // Fetching venue details based on venue id from foursquare API using Fetch API
    this.state.locations.map(location =>
      fetch(
        `https://api.foursquare.com/v2/venues/${location.venue_id}` +
          `?client_id=${data_credentials.CLIENT_ID}` +
          `&client_secret=${data_credentials.CLIENT_SECRET}` +
          `&v=20180323`
      )
        .then(response => response.json())
        .then(data => {
          if (data.meta.code === 200) {
            tips.push(data.response.venue);
          }
        })
        .then(() => this.setState({ tips }))
        .catch(error => {
          console.log(error);
        })
    );
  }

  // Set the markers to the map
  setMarkers(map) {
    let markers = this.state.locations
      .filter(location => location.visible)
      .map(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.location.lat, lng: location.location.lng },
          map,
          title: location.title
        });
        // To get the corresponding venue details based on venue id
        let findVenueDetails = (title, tips) => {
          if (tips) {
            const venueId = this.state.locations[
              this.state.locations.findIndex(ele => ele.title === title)
            ].venue_id;
            return tips[tips.findIndex(tipDet => tipDet.id === venueId)];
          }
          return;
        };

        // Adding the events to the markers on map
        marker.addListener("click", () => {
          let venueDetails = findVenueDetails(marker.title, this.state.tips);
          this.state.map.panTo(marker.getPosition());

          this.state.infoWindow.setContent(`
                    <div tabIndex="1" name=${marker.title}>
                        <p>${marker.title}</p>
                        <p>${venueDetails.location.address}, ${
            venueDetails.location.city
          } ${venueDetails.location.state}</p>
                        <p>${venueDetails.location.cc} Phone: ${
            venueDetails.contact.formattedPhone
          }</p>
                        <p>Tip provided by <a tabIndex="1" href="https://foursquare.com/">FOURSQUARE</a></p>
                    </div>`);

          this.state.infoWindow.open(map, marker);
        });

        marker.addListener("mouseover", function() {
          this.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => this.setAnimation(null), 400);
        });

        marker.addListener("mouseout", function() {
          this.setAnimation(null);
        });

        return marker;
      });
    this.setState({ markers });
  }

  //LoadMap function made with help from https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/
  loadMap() {
    //Check if Google props has data and Map is loaded
    if (this.props && this.props.google) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.58527955642508, lng: -122.35178615532263 },
        zoom: 11
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: "content"
      });
      this.setState({ map, infoWindow });
      this.setMarkers(map);
    }
  }

  render() {
    const {
      searchQuery,
      locations,
      map,
      infoWindow,
      markers,
      tips
    } = this.state;
    const style = {
      height: window.innerHeight + "px"
    };

    return (
      <div className="container" role="main">
        <div className="map-container">
          <div id="map" aria-hidden="true" style={style} role="application" />
        </div>

        <Sidenav
          searchQuery={searchQuery}
          locations={locations}
          tips={tips}
          markers={markers}
          map={map}
          infoWindow={infoWindow}
          filter={this.filter}
        />
      </div>
    );
  }
}

export default Map;

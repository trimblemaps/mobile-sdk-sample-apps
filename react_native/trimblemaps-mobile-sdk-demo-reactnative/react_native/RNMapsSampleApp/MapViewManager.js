import React from "react";
import { Platform, requireNativeComponent } from "react-native";
import PropTypes from 'prop-types';

// For iOS, MapView resolves to MapViewManager
const viewName = Platform.OS === "android" ? "MapViewManager" : "MapView";
const TMGLMapView = requireNativeComponent(viewName);

export class MapViewManager extends React.Component {
  render() {
    return <TMGLMapView {...this.props} />;
  }
}

// the props listed here are only for ios, it will have no effect on android
MapViewManager.propTypes = {
  /**
   * callback for when recieving map finished loading event
   */
  onMapLoaded: PropTypes.func,
  /**
   * callback for when recieving map style loaded event
   */
  onMapStyleLoaded: PropTypes.func,
  /**
   * callback for when receiving new user location pings
   */
  onUpdateUserLocation: PropTypes.func,
  /**
   * callback for when failing to receive new user location ping
   */
  onFailUpdateUserLocation: PropTypes.func,
  /**
   * callback for tap gesture
   */
  onTapGesture: PropTypes.func,
  /**
   * whether or not to show user location
   */
  showsUserLocation: PropTypes.bool,
  /**
   * whether or not to show heading indicator
   */
  showsUserHeadingIndicator: PropTypes.bool,
  /**
   * tracking mode to use if user location is available
   */
  userTrackingMode: PropTypes.number,
  /**
   * url for map style. values can be found in StyleManagerModule
   */
  styleURL: PropTypes.string,
  /**
   * unique tag number to be used for the native ios Trimble Maps map view
   */
  tag: PropTypes.number,
};

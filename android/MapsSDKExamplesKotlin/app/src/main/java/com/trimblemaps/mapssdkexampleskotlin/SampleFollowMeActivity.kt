package com.trimblemaps.mapssdkexampleskotlin

import android.annotation.SuppressLint
import android.app.Activity
import android.location.Location
import android.os.Bundle
import android.view.View
import android.widget.Button
import com.trimblemaps.android.core.location.*
import com.trimblemaps.android.gestures.MoveGestureDetector
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.location.LocationComponent
import com.trimblemaps.mapsdk.location.LocationComponentActivationOptions
import com.trimblemaps.mapsdk.location.LocationUpdate
import com.trimblemaps.mapsdk.location.modes.CameraMode
import com.trimblemaps.mapsdk.location.modes.RenderMode
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.OnMapReadyCallback
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap.OnMoveListener


class SampleFollowMeActivity : Activity(), OnMapReadyCallback,
    LocationEngineCallback<LocationEngineResult>, OnMoveListener {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private var locationComponent: LocationComponent? = null
    private var locationEngine: LocationEngine? = null
    private var recenter: Button? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_follow_me)

        // Find the recenter button
        recenter = findViewById<View>(R.id.btn_recenter) as Button

        // Set up the MapView from the layout
        mapView = findViewById<View>(R.id.mapView) as MapView

        // Implementing OnMapReadyCallback into the activity
        mapView!!.getMapAsync(this)
    }

    override fun onMapReady(trimbleMapsMap: TrimbleMapsMap) {
        // The TrimbleMapsMap object is created, now a style can be applied to render a map.
        map = trimbleMapsMap
        map!!.addOnMoveListener(this)
        map!!.setStyle(Style.TrimbleMobileStyle.MOBILE_DAY) { // Not setting the start location here, as that will be tracked by the user's
            // location. Instead, just defining the initial zoom.
            map!!.cameraPosition = CameraPosition.Builder().zoom(15.0).build()
            setupLocationComponent()
        }
    }

    // Before a user's location can be used, location permissions will need to
    // be given to the app. This code assumes those permissions have already been granted by this
    // point. For more information on how to grant location permissions to your app,
    // see: https://developer.android.com/training/location/permissions
    @SuppressLint("MissingPermission")
    fun setupLocationComponent() {
        // Create the location component
        locationComponent = map!!.locationComponent
        // Set the style to attach it to, in this case the current style on the map
        locationComponent!!.activateLocationComponent(
            LocationComponentActivationOptions.builder(
                this,
                map!!.style!!
            ).build()
        )
        // Turn it on
        locationComponent!!.isLocationComponentEnabled = true

        // Set the tracking and render modes
        // Tracking with the compass allows bearing to rotate the map as needed.
        locationComponent!!.cameraMode = CameraMode.TRACKING_COMPASS
        locationComponent!!.renderMode = RenderMode.COMPASS

        // Set the location engine
        locationEngine = LocationEngineProvider.getBestLocationEngine(this)
        startTracking()
    }

    @SuppressLint("MissingPermission")
    fun startTracking() {
        // Create the location engine request to track any changes to a user's location.
        val locationEngineRequest = LocationEngineRequest.Builder(DEFAULT_INTERVAL_IN_MILLISECONDS)
            .setPriority(LocationEngineRequest.PRIORITY_HIGH_ACCURACY)
            .setMaxWaitTime(DEFAULT_MAX_WAIT_TIME)
            .build()

        // Start listening for changes to location, then fire the callback with the result
        locationEngine!!.requestLocationUpdates(locationEngineRequest, this, mainLooper)
        // Start with the last current location
        locationEngine!!.getLastLocation(this)
    }

    override fun onSuccess(result: LocationEngineResult) {
        // We have a successful callback, check the location isn't null and update as needed.
        val currentLocation: Location? = result.lastLocation
        if (currentLocation != null) {
            val locationUpdate = LocationUpdate.Builder()
                .location(result.lastLocation) // Set the location from the result
                .animationDuration(java.lang.Long.valueOf(ANIMATION_TIME.toLong()))
                .build()
            map!!.locationComponent.forceLocationUpdate(locationUpdate)
        }
    }

    @SuppressLint("MissingPermission")
    fun onButtonRecenterClick(view: View) {
        // When Recenter is tapped, use the tracking mode
        locationComponent!!.cameraMode = CameraMode.TRACKING_COMPASS
        // Force an update
        locationEngine!!.getLastLocation(this)
        // Hide the button
        recenter?.visibility = View.INVISIBLE
    }

    override fun onFailure(exception: Exception) {
        // The request failed
    }

    override fun onMoveBegin(moveGestureDetector: MoveGestureDetector) {
        // when the user begins to move the map
        // Display the recenter button since panning has happened
        recenter?.visibility = View.VISIBLE
    }

    override fun onMove(moveGestureDetector: MoveGestureDetector) {
        // the user is moving the map
    }

    override fun onMoveEnd(moveGestureDetector: MoveGestureDetector) {
        // the user has stopped moving the map
    }

    companion object {
        private const val DEFAULT_INTERVAL_IN_MILLISECONDS = 900L
        private const val DEFAULT_MAX_WAIT_TIME = DEFAULT_INTERVAL_IN_MILLISECONDS * 5
        private const val ANIMATION_TIME = 400
    }

    override fun onStart() {
        super.onStart()
        mapView?.onStart()
    }

    override fun onResume() {
        super.onResume()
        mapView?.onResume()
    }

    override fun onPause() {
        super.onPause()
        mapView?.onPause()
    }

    override fun onStop() {
        super.onStop()
        mapView?.onStop()
    }

    override fun onLowMemory() {
        super.onLowMemory()
        mapView?.onLowMemory()
    }

    override fun onDestroy() {
        super.onDestroy()
        mapView?.onDestroy()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        if (outState != null) {
            super.onSaveInstanceState(outState)
            mapView?.onSaveInstanceState(outState)
        }
    }

}

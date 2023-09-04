package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.os.Bundle
import android.view.View
import android.widget.Button
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap


class SampleTrimbleLayersActivity : Activity() {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_trimble_layers)

        // Set up the MapView from the layout
        mapView = findViewById<View>(R.id.mapView) as MapView
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView!!.getMapAsync { trimbleMapsMap -> // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            map = trimbleMapsMap
            val position = CameraPosition.Builder()
                .target(LatLng(40.7584766, -73.9840227))
                .zoom(13.0)
                .build()
            map!!.cameraPosition = position
            map!!.setStyle(Style.MOBILE_DEFAULT)
        }
    }

    // Function called when a button in the layout is pressed.
    fun onClickToggleTrimbleLayer(view: View) {
        // Simple switch statement on the button's text, layers will toggle depending on what was pressed
        // The button's label is used for the switch statement for readability purposes.
        // Toggle's are used here, but these layers can also be implicitly set with boolean values.
        // E.g. map.setTrafficVisibility(true);
        when ((view as Button).text.toString().lowercase()) {
            "traffic" -> map!!.toggleTrafficVisibility()
            "3d buildings" -> map!!.toggle3dBuildingVisibility()
            "pois" -> map!!.togglePoiVisibility()
            "weather" -> map!!.toggleWeatherAlertVisibility()
        }
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

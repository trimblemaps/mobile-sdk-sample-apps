package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.os.Bundle
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.OnMapReadyCallback
import com.trimblemaps.mapsdk.maps.Style


class SampleBasicMapActivity : Activity() {
    private var mapView: MapView? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_basic_map)

        // Set up the MapView from the layout
        mapView = findViewById(R.id.mapView)
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync(OnMapReadyCallback { trimbleMapsMap ->
            // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            trimbleMapsMap.setStyle(Style.TrimbleMobileStyle.MOBILE_DAY) {
                // The style is loaded, you can add content to the map, move it etc.
            }
        })
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

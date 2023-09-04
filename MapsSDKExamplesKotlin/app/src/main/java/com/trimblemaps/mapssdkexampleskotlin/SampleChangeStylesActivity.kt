package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.Toast
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap


class SampleChangeStylesActivity : Activity(), Style.OnStyleLoaded {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private var chosenStyle = "Day Style" // Used for toasts
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_change_styles)

        // Set up the MapView from the layout
        mapView = findViewById<View>(R.id.mapView) as MapView
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView!!.getMapAsync { trimbleMapsMap -> // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            // Set the initial camera position for a starting location
            map = trimbleMapsMap
            val position = CameraPosition.Builder()
                .target(LatLng(40.7584766, -73.9840227))
                .zoom(13.0)
                .build()
            map!!.cameraPosition = position

            // Set the style, the callback is implemented into the class.
            map!!.setStyle(Style.MOBILE_DAY, this@SampleChangeStylesActivity)
        }
    }

    // When the buttons in the layout are clicked, this function is called to change the style
    fun onClickChangeStyle(view: View) {
        // Simple switch statement on the button's text, style will change depending on it.
        when ((view as Button).text.toString()) {
            "Satellite" -> {
                chosenStyle = "Satellite Style"
                map?.setStyle(Style.SATELLITE, this)
            }
            "Day" -> {
                chosenStyle = "Day Style"
                map?.setStyle(Style.MOBILE_DAY, this)
            }
            "Night" -> {
                chosenStyle = "Night Style"
                map?.setStyle(Style.MOBILE_NIGHT, this)
            }
        }
    }

    // Implemented onStyleLoaded to the class. When the style is changed a small toast appears to
    // confirm the choice.
    override fun onStyleLoaded(style: Style) {
        val toast = Toast.makeText(this@SampleChangeStylesActivity, chosenStyle, Toast.LENGTH_SHORT)
        toast.show()
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

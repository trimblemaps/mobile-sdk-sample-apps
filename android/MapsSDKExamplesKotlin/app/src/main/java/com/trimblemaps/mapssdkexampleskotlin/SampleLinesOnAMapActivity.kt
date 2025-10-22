package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.View
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.style.layers.LineLayer
import com.trimblemaps.mapsdk.style.layers.PropertyFactory
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource
import java.net.URI
import java.net.URISyntaxException


class SampleLinesOnAMapActivity : Activity(), Style.OnStyleLoaded {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private val SOURCE_ID = "linesource"
    private val LAYER_ID = "linelayer"
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_lines_on_a_map)

        // Set up the MapView from the layout
        mapView = findViewById<View>(R.id.mapView) as MapView

        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView!!.getMapAsync { trimbleMapsMap -> // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            map = trimbleMapsMap
            val position = CameraPosition.Builder()
                .target(LatLng(40.60902838712187, -97.73800045737227))
                .zoom(2.5)
                .build()
            map!!.cameraPosition = position

            // This class implements the onStyleLoaded method, that will be called when
            // the style has been loaded.
            map!!.setStyle(Style.TrimbleMobileStyle.MOBILE_DAY, this@SampleLinesOnAMapActivity)
        }
    }

    override fun onStyleLoaded(style: Style) {
        // In this example a .json file from the assets folder is being used as the source
        // This sample can be found here: @TODO ADD LINK
        // Geojson can either be passed in as a string or the result of a URI call.
        try {
            // Create a source and add it to the style. Important to note, sources are linked to styles.
            // If you change the style you may need to re-add your source and layers
            style.addSource(GeoJsonSource(SOURCE_ID, URI("asset://lines.json")))
            // // See sample JSON file (lines.json) below

            // Create a LineLayer to display our source information.
            val lineLayer = LineLayer(LAYER_ID, SOURCE_ID)
            lineLayer.setProperties(
                PropertyFactory.lineWidth(6f),
                PropertyFactory.lineColor(Color.BLUE),
                PropertyFactory.lineOpacity(.8f)
            )

            // add the layer
            style.addLayer(lineLayer)
        } catch (e: URISyntaxException) {
            e.printStackTrace()
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

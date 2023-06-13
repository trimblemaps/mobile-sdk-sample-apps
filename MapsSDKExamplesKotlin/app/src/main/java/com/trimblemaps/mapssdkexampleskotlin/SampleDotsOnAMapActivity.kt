package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.View
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.style.layers.CircleLayer
import com.trimblemaps.mapsdk.style.layers.PropertyFactory
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource
import java.net.URI
import java.net.URISyntaxException


class SampleDotsOnAMapActivity : Activity(), Style.OnStyleLoaded {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private val SOURCE_ID = "tristatepoints"
    private val LAYER_ID = "tristatepoints"
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_dots_on_a_map)

        // Set up the MapView from the layout
        mapView = findViewById<View>(R.id.mapView) as MapView

        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView!!.getMapAsync { trimbleMapsMap -> // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            map = trimbleMapsMap
            val position = CameraPosition.Builder()
                .target(LatLng(41.36290180612575, -74.6946761628674))
                .zoom(13.0)
                .build()
            map!!.cameraPosition = position

            // This class implements the onStyleLoaded method, that will be called when
            // the style has been loaded.
            map!!.setStyle(Style.MOBILE_NIGHT, this@SampleDotsOnAMapActivity)
        }
    }

    override fun onStyleLoaded(style: Style) {
        // In this example a .json file from the assets folder is being used as the source
        // Geojson can either be passed in as a string or the result of a URI call.
        try {
            // Create a source and add it to the style. Important to note, sources are linked to styles.
            // If you change the style you may need to re-add your source and layers
            style.addSource(GeoJsonSource(SOURCE_ID, URI("asset://tristate.json")))
            // See sample JSON file (tristate.json) below

            // Create a CircleLayer to display our source information.
            val circleLayer = CircleLayer(LAYER_ID, SOURCE_ID)
            circleLayer.setProperties(
                PropertyFactory.circleRadius(4f),
                PropertyFactory.circleColor(Color.WHITE),
                PropertyFactory.circleStrokeColor(Color.RED),
                PropertyFactory.circleStrokeWidth(5f)
            )

            // add the layer
            style.addLayer(circleLayer)
        } catch (e: URISyntaxException) {
            e.printStackTrace()
        }
    }
}

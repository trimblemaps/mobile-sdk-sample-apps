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
import com.trimblemaps.mapsdk.style.expressions.Expression
import com.trimblemaps.mapsdk.style.expressions.Expression.*
import com.trimblemaps.mapsdk.style.layers.CircleLayer
import com.trimblemaps.mapsdk.style.layers.PropertyFactory
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource
import java.net.URI
import java.net.URISyntaxException


class SampleDataDrivenStylingActivity : Activity(), Style.OnStyleLoaded {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private val SOURCE_ID = "tristatepoints"
    private val LAYER_ID = "tristatepoints"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_data_driven_styling)

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
            map!!.setStyle(Style.MOBILE_NIGHT, this@SampleDataDrivenStylingActivity)
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
            circleLayer.setProperties( // Changing the circle radius and stroke width based on the zoom level
                PropertyFactory.circleRadius(
                    interpolate(
                        linear(),
                        zoom(),
                        stop(12f, 2f),
                        stop(22f, 10f)
                    )
                ),
                PropertyFactory.circleStrokeWidth(
                    interpolate(
                        linear(),
                        zoom(),
                        stop(12f, 1f),
                        stop(22f, 12f)
                    )
                ),  // Change the color of the circle stroke based on the "state" property in the
                // json source data. The first color used is the default color if no 'match' is
                // found
                PropertyFactory.circleStrokeColor(
                    Expression.match(
                        Expression.get("state"), Expression.color(Color.BLACK),
                        Expression.stop("PA", Expression.color(Color.GREEN)),
                        Expression.stop("NY", Expression.color(Color.BLUE)),
                        Expression.stop("NJ", Expression.color(Color.RED))
                    )
                ),
                PropertyFactory.circleColor(Color.WHITE)
            )

            // add the layer
            style.addLayer(circleLayer)
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
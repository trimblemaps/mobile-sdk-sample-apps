package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.graphics.BitmapFactory
import android.graphics.Color
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AlertDialog
import com.trimblemaps.geojson.FeatureCollection
import com.trimblemaps.geojson.Point
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.style.layers.PropertyFactory
import com.trimblemaps.mapsdk.style.layers.SymbolLayer
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource
import java.io.InputStreamReader

class SampleClickablePointsActivity : Activity(), Style.OnStyleLoaded {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private val SOURCE_ID = "tristatepoints"
    private val LAYER_ID = "tristatepoints"
    private val ICON_ID = "location-icon"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_clickable_points)

        // Set up the MapView from the layout
        mapView = findViewById<View>(R.id.mapView) as MapView

        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync { trimbleMapsMap -> // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            map = trimbleMapsMap
            val position = CameraPosition.Builder()
                .target(LatLng(41.36290180612575, -74.6946761628674))
                .zoom(13.0)
                .build()
            map?.cameraPosition = position
            map?.setStyle(Style.SATELLITE, this@SampleClickablePointsActivity)
        }
    }

    override fun onStyleLoaded(style: Style) {
        // Add the icon to the style
        val iconBitmap = BitmapFactory.decodeResource(resources, R.drawable.basic_icon_faqs)
        style.addImage(ICON_ID, iconBitmap)

        // Load points from the GeoJson file
        try {
            val inputStream = assets.open("tristate.json")
            val geoJson = InputStreamReader(inputStream).readText()
            val featureCollection = FeatureCollection.fromJson(geoJson)

            // Create a GeoJsonSource with the loaded data
            val source = GeoJsonSource(SOURCE_ID, featureCollection)
            style.addSource(source)

            // Create a SymbolLayer to display our source information as icons
            val symbolLayer = SymbolLayer(LAYER_ID, SOURCE_ID)
            symbolLayer.setProperties(
                PropertyFactory.iconImage(ICON_ID),
                PropertyFactory.iconSize(1.0f),
                PropertyFactory.iconColor(Color.RED)
            )

            // Add the layer
            style.addLayer(symbolLayer)

            // Set up a click listener to show a popup with state and coordinates information
            map?.addOnMapClickListener { point ->
                val screenPoint = map?.projection?.toScreenLocation(point)
                val features = map?.queryRenderedFeatures(screenPoint!!, LAYER_ID)
                if (!features.isNullOrEmpty()) {
                    val feature = features[0]
                    val state = feature.getStringProperty("state")
                    val coordinates = (feature.geometry() as Point).coordinates()
                    val message = "State: $state\nCoordinates: $coordinates"

                    // Create and show the popup
                    AlertDialog.Builder(this)
                        .setTitle("Location Info")
                        .setMessage(message)
                        .setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
                        .show()
                }
                true
            }
        } catch (e: Exception) {
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
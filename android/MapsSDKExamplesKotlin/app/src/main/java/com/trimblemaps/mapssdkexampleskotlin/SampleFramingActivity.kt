package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.Button
import com.trimblemaps.geojson.FeatureCollection
import com.trimblemaps.geojson.LineString
import com.trimblemaps.geojson.Point
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.camera.CameraUpdate
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.style.layers.LineLayer
import com.trimblemaps.mapsdk.style.layers.PropertyFactory
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource
import com.trimblemaps.mapsdk.plugins.places.common.utils.CameraUtils
import java.io.InputStreamReader

class SampleFramingActivity : Activity(), Style.OnStyleLoaded {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private var currentIndex = 0
    private val SOURCE_ID = "linesource"
    private val LAYER_ID = "linelayer"
    private lateinit var allLines: List<LineString>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_framing)

        // Set up the MapView from the layout
        mapView = findViewById<View>(R.id.mapView) as MapView

        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync { trimbleMapsMap ->
            map = trimbleMapsMap
            val position = CameraPosition.Builder()
                .target(LatLng(40.60902838712187, -97.73800045737227))
                .zoom(2.5)
                .build()
            map?.cameraPosition = position
            map?.setStyle(Style.MOBILE_DAY, this@SampleFramingActivity)
        }

        // When the button is clicked, cycle through the lines using trimbleMapsMap.moveCamera
        findViewById<Button>(R.id.btn_cycleLocations).setOnClickListener {
            map?.let { trimbleMapsMap ->
                if (allLines.isNotEmpty()) {
                    val selectedLine = allLines[currentIndex]
                    val pointList = selectedLine.coordinates().map { point ->
                        Point.fromLngLat(point.longitude(), point.latitude())
                    }
                    val update: CameraUpdate? = CameraUtils.frameLocationOrPolygon(
                        null, // No specific location to frame
                        pointList
                    )
                    if (update != null) {
                        trimbleMapsMap.moveCamera(update)
                    }
                    currentIndex = (currentIndex + 1) % allLines.size
                }
            }
        }

        // When the button is clicked, cycle through the lines using trimbleMapsMap.easeCamera
        findViewById<Button>(R.id.btn_easeCamera).setOnClickListener {
            map?.let { trimbleMapsMap ->
                if (allLines.isNotEmpty()) {
                    val selectedLine = allLines[currentIndex]
                    val pointList = selectedLine.coordinates().map { point ->
                        Point.fromLngLat(point.longitude(), point.latitude())
                    }
                    val update: CameraUpdate? = CameraUtils.frameLocationOrPolygon(
                        null, // No specific location to frame
                        pointList
                    )
                    if (update != null) {
                        trimbleMapsMap.easeCamera(update)
                    }
                    currentIndex = (currentIndex + 1) % allLines.size
                }
            }
        }
    }

    override fun onStyleLoaded(style: Style) {
        // Load lines from the GeoJson file
        try {
            val inputStream = assets.open("lines.json")
            val geoJson = InputStreamReader(inputStream).readText()
            val featureCollection = FeatureCollection.fromJson(geoJson)
            allLines = featureCollection.features()?.mapNotNull { feature ->
                feature.geometry() as? LineString
            } ?: emptyList()

            // Create a GeoJsonSource with the loaded data
            val source = GeoJsonSource(SOURCE_ID, featureCollection)
            style.addSource(source)

            // Create a LineLayer to display our source information.
            val lineLayer = LineLayer(LAYER_ID, SOURCE_ID)
            lineLayer.setProperties(
                PropertyFactory.lineWidth(6f),
                PropertyFactory.lineColor(Color.BLUE),
                PropertyFactory.lineOpacity(.8f)
            )

            // Add the layer
            style.addLayer(lineLayer)
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
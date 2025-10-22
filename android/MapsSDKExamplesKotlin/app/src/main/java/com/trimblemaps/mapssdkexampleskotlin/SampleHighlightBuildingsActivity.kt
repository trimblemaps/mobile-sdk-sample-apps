package com.trimblemaps.mapssdkexampleskotlin

import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.geojson.Feature
import com.trimblemaps.geojson.FeatureCollection
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.style.layers.LineLayer
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.lineColor
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.lineOpacity
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.lineWidth
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource

class SampleHighlightBuildingActivity : AppCompatActivity() {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private var highlights : List<Feature> = listOf()
    private var highlightsSrcLayer = "highlighted_buildings"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)

        setContentView(R.layout.activity_sample_highlight_building)


        // Set up the MapView from the layout
        mapView = findViewById(R.id.mapView)
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync { trimbleMapsMap ->
            map = trimbleMapsMap

            // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            // Adding the source and layer for the buildings highlighted. Building outlines will be
            // displayed in yellow

            trimbleMapsMap.setStyle(Style
                .Builder()
                .fromUri(Style.TrimbleMobileStyle.MOBILE_NIGHT)
                .withSource(GeoJsonSource(highlightsSrcLayer, FeatureCollection.fromFeatures(highlights)))
                .withLayer(LineLayer(highlightsSrcLayer, highlightsSrcLayer).withProperties(
                    lineWidth(4f),
                    lineColor(Color.YELLOW),
                    lineOpacity(.8f)
                ))
            )

            map?.cameraPosition = CameraPosition.Builder()
                .target(LatLng(39.96012475826224, -75.16184676002608))
                .zoom(17.0)
                .build()

            map?.addOnMapClickListener {clickedLatLng ->
                // Convert our LatLng to a pixel
                val pixel = map?.projection?.toScreenLocation(clickedLatLng)

                // Find any features from the "building_2d" layer that our point intersects
                val features = map?.queryRenderedFeatures(pixel!!, "building_2d")

                // Update/Replace the source of data with these new found features
                map?.style?.getSourceAs<GeoJsonSource>(highlightsSrcLayer)?.setGeoJson(
                    FeatureCollection.fromFeatures(features!!))

                return@addOnMapClickListener true
            }
        }
    }

    /**
     * Activity Overrides
     */
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
}

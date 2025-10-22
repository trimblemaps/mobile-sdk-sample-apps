package com.trimblemaps.mapssdkexampleskotlin

import android.graphics.Color
import android.graphics.RectF
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.android.gestures.MoveGestureDetector
import com.trimblemaps.geojson.Feature
import com.trimblemaps.geojson.FeatureCollection
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap.OnMoveListener
import com.trimblemaps.mapsdk.style.layers.LineLayer
import com.trimblemaps.mapsdk.style.layers.PropertyFactory
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource

class SampleHighlightFeaturesAfterPanningActivity : AppCompatActivity() {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null

    private var highlights : List<Feature> = listOf()
    private var highlightsSrcLayer = "highlighted_places"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)

        setContentView(R.layout.activity_sample_highlight_features)


        // Set up the MapView from the layout
        mapView = findViewById(R.id.mapView)
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync { trimbleMapsMap ->
            map = trimbleMapsMap

            // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            // Adding the source and layer for the Places highlighted. Site outlines will be
            // displayed in yellow

            trimbleMapsMap.setStyle(
                Style
                .Builder()
                .fromUri(Style.TrimbleMobileStyle.MOBILE_NIGHT)
                .withSource(GeoJsonSource(highlightsSrcLayer, FeatureCollection.fromFeatures(highlights)))
                .withLayer(
                    LineLayer(highlightsSrcLayer, highlightsSrcLayer).withProperties(
                        PropertyFactory.lineWidth(4f),
                        PropertyFactory.lineColor(Color.YELLOW),
                        PropertyFactory.lineOpacity(.8f)
                ))
            )

            map?.cameraPosition = CameraPosition.Builder()
                .target(LatLng( 40.570247273677154, -74.2586578116128))
                .zoom(15.0)
                .build()

            map?.addOnMoveListener(object : OnMoveListener {
                override fun onMoveBegin(moveGestureDetector: MoveGestureDetector) {

                }

                override fun onMove(moveGestureDetector: MoveGestureDetector) {

                }

                override fun onMoveEnd(moveGestureDetector: MoveGestureDetector) {
                    // We only care about when movement stops
                    // get all features in the user's current view
                    val view = RectF(mapView?.left!!.toFloat(), mapView?.top!!.toFloat(), mapView?.right!!.toFloat(), mapView?.bottom!!.toFloat())

                    // Find any features from the "places_sites" layer that our point intersects
                    val features = map?.queryRenderedFeatures(view, "places_sites")

                    // Update/Replace the source of data with these new found features
                    map?.style?.getSourceAs<GeoJsonSource>(highlightsSrcLayer)?.setGeoJson(
                        FeatureCollection.fromFeatures(features!!))
                }

            })
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

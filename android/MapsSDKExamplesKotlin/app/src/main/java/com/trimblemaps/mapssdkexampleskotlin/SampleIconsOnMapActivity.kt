package com.trimblemaps.mapssdkexampleskotlin

import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.geojson.Feature
import com.trimblemaps.geojson.FeatureCollection
import com.trimblemaps.geojson.Point
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.style.expressions.Expression.get
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.iconAllowOverlap
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.iconIgnorePlacement
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.iconImage
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.iconSize
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.textColor
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.textField
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.textOffset
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.textSize
import com.trimblemaps.mapsdk.style.layers.SymbolLayer
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource
import com.trimblemaps.mapsdk.utils.BitmapUtils

class SampleIconsOnMapActivity : AppCompatActivity() {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Authorize the api key for the session.
        // .apiKey() requires your Trimble Maps API key
        val trimbleMapsAccount = TrimbleMapsAccount.builder()
            .apiKey("Your-API-key-here")
            .addLicensedFeature(LicensedFeature.MAPS_SDK)
            .build()

        // Initialize the session
        TrimbleMapsAccountManager.initialize(trimbleMapsAccount)
        TrimbleMapsAccountManager.awaitInitialization()

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)

        setContentView(R.layout.activity_sample_icons_on_map)


        // Content for the map, source with geojson and a symbol layer to display the icons on the map
        val sourceLayerId = "myIconSample"
        val iconId = "myIcon"
        val features = listOf(
            Feature.fromGeometry(
                Point.fromLngLat(
                    -124.04248631027056,
                    41.399886315073665
                )
            ).apply{addStringProperty("name", "Redwood National Park")},
            Feature.fromGeometry(
                Point.fromLngLat(
                    -119.54168883187751,
                    37.86132968939011
                )
            ).apply{addStringProperty("name", "Yosemite National Park")},
            Feature.fromGeometry(
                Point.fromLngLat(
                    -118.56866072531929,
                    36.48423806412702
                )
            ).apply{addStringProperty("name", "Sequoia National Park")},
            Feature.fromGeometry(
                Point.fromLngLat(
                    -117.08631663205512,
                    36.50272677393764
                )
            ).apply{addStringProperty("name", "Death Valley National Park")},
            Feature.fromGeometry(
                Point.fromLngLat(
                    -115.9107003346756,
                    33.837139214173405
                )
            ).apply{addStringProperty("name", "Joshua Tree National Park")}
        )


        // Set up the MapView from the layout
        mapView = findViewById(R.id.mapView)
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync { trimbleMapsMap ->
            map = trimbleMapsMap

            trimbleMapsMap.setStyle(
                Style
                    .Builder()
                    .fromUri(Style.MOBILE_DAY)
                    // Add the image to the map so it can be referenced by our source and layers later
                    .withImage(
                        iconId, BitmapUtils.getBitmapFromDrawable(
                            getDrawable(com.trimblemaps.mapsdk.R.drawable.trimblemaps_marker_icon_default)
                        )!!
                    )
                    .withSource(
                        GeoJsonSource(
                            sourceLayerId,
                            FeatureCollection.fromFeatures(features)
                        )
                    )
                    .withLayer(
                        SymbolLayer(sourceLayerId, sourceLayerId).withProperties(
                            iconImage(iconId),
                            iconSize(1f),
                            iconIgnorePlacement(true),
                            iconAllowOverlap(true),
                            textField(get("name")), // use the name property of the feature as the label
                            textSize(12f),
                            textColor(Color.DKGRAY),
                            textOffset(floatArrayOf(0f, 1f).toTypedArray()) // Offset the text to be under the icon
                        )
                    )
            )

            map?.cameraPosition = CameraPosition.Builder()
                .target(LatLng(37.226304283326805, -120.7503389562311))
                .zoom(4.5)
                .build()
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

package com.trimblemaps.mapssdkexampleskotlin

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.camera.CameraUpdateFactory
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import kotlin.random.Random

class SampleAnimatedCameraActivity : AppCompatActivity() {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private val cities : List<LatLng>  =listOf(
        LatLng(39.765654371695554, -104.97953028057314), // Denver, CO
        LatLng(36.17154274531701, -115.15669159394326), // Las Vegas, NV
        LatLng(33.45718847708079, -112.074932293209), // Phoenix, AZ,
        LatLng(40.75525433174506, -111.88587090500303) // Salt Lake City, UT
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)

        setContentView(R.layout.activity_sample_animated_camera)

        // When the button is clicked, toggle the Animated Camera feature
        findViewById<Button>(R.id.btn_randomAnimation).setOnClickListener {
            // Find a random location and zoom for our update
            val randomZoom = Random.nextDouble(from = 10.0, until = 12.0)
            val randomCity = cities[Random.nextInt(cities.size)]

            // Create a camera update using the factory.
            // Variety of choices with CameraUpdateFactor such as, newLatLngZoom, newLatLngBounds etc
            val cameraUpdate = CameraUpdateFactory.newLatLngZoom(randomCity, randomZoom)
            // Animate the camera and provide an (optional) duration for the change in milliseconds
            map?.animateCamera(cameraUpdate, 1000)

        }

        // Set up the MapView from the layout
        mapView = findViewById(R.id.mapView)
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync { trimbleMapsMap ->
            map = trimbleMapsMap
            // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            trimbleMapsMap.setStyle(Style.MOBILE_DAY)

            // Set the initial position of the camera.
            map?.cameraPosition = CameraPosition.Builder()
                .target(cities[0])
                .zoom(11.0)
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

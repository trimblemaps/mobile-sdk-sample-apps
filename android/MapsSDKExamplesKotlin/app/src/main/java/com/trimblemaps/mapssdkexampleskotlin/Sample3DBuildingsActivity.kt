package com.trimblemaps.mapssdkexampleskotlin

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap

class Sample3DBuildingsActivity : AppCompatActivity() {

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

        setContentView(R.layout.activity_sample_3dbuildings)

        // When the button is clicked, toggle the 3D building feature
        findViewById<Button>(R.id.btn_toggle3DBuildings).setOnClickListener {
            map?.toggle3dBuildingVisibility()
        }

        // Set up the MapView from the layout
        mapView = findViewById(R.id.mapView)
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync { trimbleMapsMap ->
            map = trimbleMapsMap
            // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            trimbleMapsMap.setStyle(Style.MOBILE_DAY)

            // Set the initial position of the camera, as well as tilting the camera slightly
            // tilting the camera will make the 3D extrusions more obvious.
            map?.cameraPosition = CameraPosition.Builder()
                .target(LatLng(40.704615, -74.014079))
                .zoom(16.0)
                .tilt(55.0)
                .build()

            // Initial visibility is set to true
            map?.set3dBuildingVisibility(true)

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

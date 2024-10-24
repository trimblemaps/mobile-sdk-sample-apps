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
import com.trimblemaps.mapsdk.geometry.LatLngBounds
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap

class SampleRestrictUserInteractionActivity : AppCompatActivity() {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)

        setContentView(R.layout.activity_sample_restrict_user_interaction)

        // When the button is clicked, toggle the 3D building feature
        findViewById<Button>(R.id.btn_toggleAllowGestures).setOnClickListener {

            // Toggle gestures on the map
            // When this is false, the user will not be able to interact with the map
            // no panning, pinch to zoom etc.
            val gesturesEnabled = map?.uiSettings?.areAllGesturesEnabled()
            map?.uiSettings?.setAllGesturesEnabled(!gesturesEnabled!!)
        }

        // Set up the MapView from the layout
        mapView = findViewById(R.id.mapView)
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync { trimbleMapsMap ->
            map = trimbleMapsMap
            // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            trimbleMapsMap.setStyle(Style.MOBILE_DAY)

            val cameraPosition  = CameraPosition.Builder()
                .target(LatLng(40.35406213631131, -74.66366338445839)) // Princeton NJ
                .zoom(13.0)
                .build()

            // Set the initial position of the camera.
            map?.cameraPosition = cameraPosition

            // Restrict map panning to the bounds of Princeton NJ USA, done using NW and SE coordinates to
            // create a bounding box
            val northWesternLatLng = LatLng(40.35707083424728, -74.67911290722856)
            val southEasternLatLng = LatLng(40.34621272718235, -74.62400960934826)
            // Build the bounds
            val boundsArea = LatLngBounds.Builder()
                .include(northWesternLatLng)
                .include(southEasternLatLng)
                .build()
            map?.setLatLngBoundsForCameraTarget(boundsArea)
            map?.setMinZoomPreference(9.0)
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

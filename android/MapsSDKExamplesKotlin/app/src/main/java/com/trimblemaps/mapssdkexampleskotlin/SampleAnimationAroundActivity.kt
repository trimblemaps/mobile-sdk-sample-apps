package com.trimblemaps.mapssdkexampleskotlin

import android.animation.ValueAnimator
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.animation.LinearInterpolator
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
import kotlin.math.roundToLong

class SampleAnimateAroundActivity : AppCompatActivity() {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private var shouldAnimate = false
    private val numberOfSpins = 8f // How many times should it spin
    private val spinDuration = 16 // how long, in seconds, should a spin take

    // Working with an animator
    private var animator : ValueAnimator = ValueAnimator.ofFloat(0f, numberOfSpins * 360)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)

        setContentView(R.layout.activity_sample_animate_around)


        // Set up the MapView from the layout
        mapView = findViewById(R.id.mapView)
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync { trimbleMapsMap ->
            map = trimbleMapsMap

            // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            // Adding the source and layer for the buildings highlighted. Building outlines will be
            // displayed in yellow

            trimbleMapsMap.setStyle(Style.MOBILE_DAY)

            map?.cameraPosition = CameraPosition.Builder()
                .target(LatLng(39.90073499962372, -75.16745401827387))
                .zoom(16.0)
                .build()

        }

        // Setup the animator
        animator.duration = (numberOfSpins * spinDuration * 1000).roundToLong()
        animator.interpolator = LinearInterpolator()
        animator.startDelay = 1000

        // Create the animation toggles
        findViewById<Button>(R.id.btn_toggleAnimation).setOnClickListener {
            shouldAnimate = !shouldAnimate
            // Should the animation be on? Are we resuming or starting from fresh?
            if(shouldAnimate) {
                if(animator.isStarted) {
                    animator.resume()
                } else {
                    animator.addUpdateListener {valueAnimator ->
                        // Get the bearing from the animator and apply it to the camera position
                        val bearing = valueAnimator.animatedValue as Float
                        map?.moveCamera(CameraUpdateFactory.newCameraPosition(
                            CameraPosition.Builder()
                                .target(map?.cameraPosition?.target)
                                .bearing(bearing.toDouble())
                                .build()
                        ))
                    }
                    animator.start()
                }
            } else {
                animator.pause()
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

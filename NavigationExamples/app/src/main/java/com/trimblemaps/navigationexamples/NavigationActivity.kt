package com.trimblemaps.navigationexamples

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.trimblemaps.api.directions.v1.models.DirectionsRoute
import com.trimblemaps.api.directions.v1.models.RouteOptions
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.location.modes.RenderMode
import com.trimblemaps.navigation.base.options.NavigationOptions
import com.trimblemaps.navigation.base.options.RouteRefreshOptions
import com.trimblemaps.navigation.base.trip.model.RouteLegProgress
import com.trimblemaps.navigation.base.trip.model.RouteProgress
import com.trimblemaps.navigation.core.TrimbleMapsTripProvider
import com.trimblemaps.navigation.core.arrival.ArrivalController
import com.trimblemaps.navigation.core.arrival.ArrivalObserver
import com.trimblemaps.navigation.core.arrival.ArrivalOptions
import com.trimblemaps.navigation.core.directions.session.RoutesRequestCallback
import com.trimblemaps.navigation.ui.NavigationViewOptions
import com.trimblemaps.navigation.ui.OnNavigationReadyCallback
import com.trimblemaps.navigation.ui.listeners.NavigationListener
import com.trimblemaps.navigationexamples.databinding.ActivityNavigationBinding

class NavigationActivity : AppCompatActivity() {

    private lateinit var binding: ActivityNavigationBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityNavigationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.navigationView.apply {
            onCreate(savedInstanceState)
            val coords = TrimbleMapsTripProvider.retrieve().stops.first().trimbleMapsLocation.coords()
            val initialPosition = CameraPosition.Builder()
                .target(LatLng(coords.lat().toDouble(), coords.lon().toDouble()))
                .zoom(15.0)
                .build()
            initialize(onNavigationReady, initialPosition)
        }
    }

    override fun onLowMemory() {
        super.onLowMemory()
        binding.navigationView.onLowMemory()
    }

    override fun onStart() {
        super.onStart()
        binding.navigationView.onStart()
    }

    override fun onResume() {
        super.onResume()
        binding.navigationView.onResume()
    }

    override fun onStop() {
        super.onStop()
        binding.navigationView.onStop()
    }

    override fun onPause() {
        super.onPause()
        binding.navigationView.onPause()
    }

    override fun onDestroy() {
        binding.navigationView?.onDestroy()
        super.onDestroy()
    }

    override fun onBackPressed() {
        if (!binding.navigationView.onBackPressed()) {
            finish()
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        binding.navigationView.onSaveInstanceState(outState)
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        binding.navigationView.onRestoreInstanceState(savedInstanceState)
    }

    private fun startNavigating() {

        binding.navigationView.retrieveNavigationMap()?.apply {
            showAlternativeRoutes(false)
            updateLocationLayerRenderMode(RenderMode.NORMAL)
        }


        // Create route refresh options
        val routeRefreshOptions = RouteRefreshOptions.Builder()
            .isRouteRefreshEnabled(false)
            .build()

        // Create navigation options
        val navigationOptions = NavigationOptions.Builder(this)
            .build()

        // Create navigation view options
        val optionsBuilder = NavigationViewOptions.builder(this).apply {
            navigationOptions(navigationOptions)
            navigationListener(navigationCallback)
            arrivalObserver(arrivalObserver)
            trip(TrimbleMapsTripProvider.retrieve())
            shouldSimulateRoute(true)
            enableVanishingRouteLine(true)
            tripPreviewEnabled(false)
        }
        binding.navigationView.apply {
            startNavigation(optionsBuilder.build())
            retrieveNavigation()?.setArrivalController(arrivalController)
            hideNavigationViewButtons()
        }
    }

    private val onNavigationReady = object : OnNavigationReadyCallback {
        override fun onNavigationReady(isRunning: Boolean) {
            startNavigating()
        }

    }

    private val navigationCallback = object: NavigationListener {
        override fun onCancelNavigation() {
            binding.navigationView.apply {
                stopNavigation()
                hideCancelNavigationBtn()
            }

            finish()
        }

        override fun onNavigationFinished() {
            finish()
        }

        override fun onNavigationRunning() {
        }

    }

    private val arrivalObserver = object : ArrivalObserver {
        override fun onFinalDestinationArrival(routeProgress: RouteProgress) {
        }

        override fun onNextRouteLegStart(routeLegProgress: RouteLegProgress) {
        }

    }

    private val arrivalController = object : ArrivalController {
        override fun arrivalOptions(): ArrivalOptions {
            return ArrivalOptions.Builder().build()
        }

        override fun navigateNextRouteLeg(routeLegProgress: RouteLegProgress): Boolean {
            return false
        }
    }
}
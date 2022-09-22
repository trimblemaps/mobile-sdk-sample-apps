package com.trimblemaps.navigationexamples

import android.content.Intent
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.trimblemaps.api.directions.v1.models.DirectionsResponse
import com.trimblemaps.api.directions.v1.models.RouteOptions
import com.trimblemaps.api.geocoding.v1.models.TrimbleMapsLocation
import com.trimblemaps.api.routingprofiles.v1.models.Profile
import com.trimblemaps.core.constants.Constants.PRECISION_6
import com.trimblemaps.geojson.LineString
import com.trimblemaps.geojson.Point
import com.trimblemaps.geojson.utils.PolylineUtils
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.OnMapReadyCallback
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.plugins.route.RouteRequestCallback
import com.trimblemaps.mapsdk.style.layers.LineLayer
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.*
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource
import com.trimblemaps.navigation.base.internal.extensions.LocaleEx.getUnitTypeForLocale
import com.trimblemaps.navigation.base.internal.extensions.inferDeviceLocale
import com.trimblemaps.navigation.core.TrimbleMapsTrip
import com.trimblemaps.navigation.core.TrimbleMapsTripProvider
import com.trimblemaps.navigation.core.trip.model.toTripStop
import com.trimblemaps.navigation.ui.components.trippreview.OnTripPreviewMapReadyCallback
import com.trimblemaps.navigation.ui.components.trippreview.TripPreviewMap
import com.trimblemaps.navigation.ui.components.trippreview.TripPreviewScreen
import com.trimblemaps.navigation.ui.internal.utils.ViewUtils
import com.trimblemaps.navigationexamples.databinding.ActivityTripPreviewBinding
import com.trimblemaps.navigationexamples.shared.Constants
import retrofit2.HttpException

class TripPreviewActivity : AppCompatActivity() {

    private lateinit var binding: ActivityTripPreviewBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityTripPreviewBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.tripPreviewScreen.apply {
            onCreate(savedInstanceState)
            mapReadyCallback = onMapReadyCallback
            startButtonCallback = startCallback
            routeRequestCallback = this@TripPreviewActivity.routeRequestCallback

        }

        if(!TrimbleMapsTripProvider.isActive()) {
            Toast.makeText(this, "Error: no trip", Toast.LENGTH_LONG).show()
        }

        binding.tripPreviewScreen.trip = TrimbleMapsTripProvider.retrieve()
    }

    public override fun onResume() {
        super.onResume()
        binding.tripPreviewScreen.onResume()
    }

    public override fun onPause() {
        super.onPause()
        binding.tripPreviewScreen.onPause()
    }

    override fun onStart() {
        super.onStart()
        binding.tripPreviewScreen.onStart()
    }

    override fun onStop() {
        super.onStop()
        binding.tripPreviewScreen.onStop()
    }

    override fun onLowMemory() {
        super.onLowMemory()
        binding.tripPreviewScreen.onLowMemory()
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.tripPreviewScreen.onDestroy()
    }

    override fun onBackPressed() {
        finish()
    }

    private val onMapReadyCallback = object : OnTripPreviewMapReadyCallback {

        override fun onTripPreviewMapRouteReady(directionsResponse: DirectionsResponse) {

        }

    }
    private val routeRequestCallback = object : RouteRequestCallback {
        override fun onRouteReady(route: DirectionsResponse?) {
            Toast.makeText(this@TripPreviewActivity, object{}.javaClass.enclosingMethod.name, Toast.LENGTH_LONG).show()
        }

        override fun onRequestFailure(throwable: Throwable, routeOptions: RouteOptions) {
            (throwable as? HttpException)?. let {
                Toast.makeText(this@TripPreviewActivity, "Directions Error: ${it.response()?.errorBody()?.string()}", Toast.LENGTH_LONG).show()
            }
        }
    }

    private val startCallback = object: TripPreviewScreen.StartButtonListener {

        override fun onStartButtonPressed(trip: TrimbleMapsTrip?, isChanged: Boolean) {
            if (isChanged && trip != null)
                TrimbleMapsTripProvider.retrieve().updateTrip(trip)

            val intent = Intent(this@TripPreviewActivity, NavigationActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

}
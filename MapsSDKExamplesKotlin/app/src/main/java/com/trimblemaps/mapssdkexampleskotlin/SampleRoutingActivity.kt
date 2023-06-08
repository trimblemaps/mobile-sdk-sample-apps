package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.Toast
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.api.directions.v1.TrimbleMapsDirections
import com.trimblemaps.api.directions.v1.models.DirectionsResponse
import com.trimblemaps.api.directions.v1.models.RouteOptions
import com.trimblemaps.geojson.Point
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import com.trimblemaps.mapsdk.plugins.route.Route
import com.trimblemaps.mapsdk.plugins.route.RoutePlugin
import com.trimblemaps.mapsdk.plugins.route.RouteRequestCallback



class SampleRoutingActivity : Activity() {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
    private var routePlugin: RoutePlugin? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Authorize the api key for the session.
        // .apiKey() requires your Trimble Maps API key
        val trimbleMapsAccount = TrimbleMapsAccount.builder()
            .apiKey(getString(R.string.API_KEY))
            .addLicensedFeature(LicensedFeature.MAPS_SDK)
            .build()

        // Initialize the session
        TrimbleMapsAccountManager.initialize(trimbleMapsAccount)
        TrimbleMapsAccountManager.awaitInitialization()

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_routing)

        // Set up the MapView from the layout
        mapView = findViewById<View>(R.id.mapView) as MapView

        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView!!.getMapAsync { trimbleMapsMap -> // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            map = trimbleMapsMap

            // Create the Route Plugin, giving it the map view it's to draw to
            routePlugin = RoutePlugin(mapView!!, map!!)
            val position = CameraPosition.Builder()
                .target(LatLng(40.34330490091359, -74.62327537264328))
                .zoom(11.0)
                .build()
            map!!.cameraPosition = position
            map!!.setStyle(Style.MOBILE_DAY) { createSimpleRoute() }
        }
    }

    fun createSimpleRoute() {
        // Generate the directions object using the TrimbleMapsDirections Builder
        val directions = TrimbleMapsDirections.builder()
            .origin(Point.fromLngLat(-74.59977385874882, 40.361202627269634))
            .destination(Point.fromLngLat(-74.77334837439244, 40.23296852563686))
            .build()

        // Create a Route object, giving it an id (used for framing later)
        val route: Route = Route.builder()
            .id("SimpleRoute") // ID for the route
            .routeOptions(directions.toRouteOptions()) // Route Options coming from TrimbleMapsDirections object
            .requestCallback(object : RouteRequestCallback {
                // Provide a callback to handle success and fails for the route.
                override fun onRouteReady(route: DirectionsResponse?) {
                    Toast.makeText(this@SampleRoutingActivity, "Routing Success", Toast.LENGTH_SHORT).show()
                }

                override fun onRequestFailure(throwable: Throwable?, routeOptions: RouteOptions?) {
                    Toast.makeText(this@SampleRoutingActivity, "Routing Fail", Toast.LENGTH_SHORT).show()
                }
            })
            .color(Color.MAGENTA) // Give the line path a colour
            .build()

        // use the route plugin to add the route to the map and frame it.
        routePlugin?.addRoute(route)
        routePlugin?.frameRoute("SimpleRoute", 30)
    }
}

package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.os.Bundle
import android.view.View
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.api.geocoding.v1.TrimbleMapsGeocoding
import com.trimblemaps.api.geocoding.v1.models.Coords
import com.trimblemaps.api.geocoding.v1.models.GeocodingResponse
import com.trimblemaps.api.geocoding.v1.models.TrimbleMapsLocation
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.camera.CameraUpdateFactory
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.maps.TrimbleMapsMap
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class SampleGeocodingActivity : Activity() {
    private var mapView: MapView? = null
    private var map: TrimbleMapsMap? = null
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
        setContentView(R.layout.activity_sample_geocoding)

        // Set up the MapView from the layout
        mapView = findViewById<View>(R.id.mapView) as MapView
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView!!.getMapAsync { trimbleMapsMap ->
            // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            map = trimbleMapsMap
            map!!.setStyle(Style.MOBILE_DEFAULT) { // The style is loaded, you can add content to the map, move it etc.
                // Style was loaded, do a geocode.
                geocode()
            }
        }
    }

    private fun geocode() {
        val geocoding = TrimbleMapsGeocoding.builder()
            .query("1 Independence Way Princeton NJ 08540") // The search query to geocode on
            .build()
        geocoding.enqueueCall(object : Callback<GeocodingResponse?> {
            override fun onResponse(call: Call<GeocodingResponse?>, response: Response<GeocodingResponse?>) {
                // Get the locations list from the response
                val results: List<TrimbleMapsLocation> = response.body()?.locations() as List<TrimbleMapsLocation>
                // If there are results available, zoom to that location on the map.
                if (results.isNotEmpty()) {
                    // Get the first result
                    val firstResult = results[0]
                    // Pull out the coordinates
                    val geocodedCoordinates: Coords = firstResult.coords()
                    // Zoom to that location
                    val cameraPosition = CameraPosition.Builder()
                        .target(LatLng(geocodedCoordinates.lat().toDouble(), geocodedCoordinates.lon().toDouble()))
                        .zoom(13.0)
                        .build()
                    map!!.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition))
                }
            }

            override fun onFailure(call: Call<GeocodingResponse?>, t: Throwable) {
                // Geocoding failed
            }
        })
    }
}



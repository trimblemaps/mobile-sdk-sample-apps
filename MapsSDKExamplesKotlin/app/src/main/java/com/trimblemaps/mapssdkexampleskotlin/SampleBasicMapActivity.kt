package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.os.Bundle
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.OnMapReadyCallback
import com.trimblemaps.mapsdk.maps.Style


class SampleBasicMapActivity : Activity() {
    private var mapView: MapView? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get an instance of the map, done before the layout is set.
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_sample_basic_map)

        // Set up the MapView from the layout
        mapView = findViewById(R.id.mapView)
        // the onMapReadyCallback is fired when the map is ready to be worked with
        mapView?.getMapAsync(OnMapReadyCallback { trimbleMapsMap ->
            // The TrimbleMapsMap object is created, now a style can be applied to render a map.
            trimbleMapsMap.setStyle(Style.MOBILE_DAY) {
                // The style is loaded, you can add content to the map, move it etc.
            }
        })
    }
}

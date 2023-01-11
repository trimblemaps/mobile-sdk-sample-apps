package com.trimblemaps.maplayerskotlin

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.trimblemaps.mapsdk.TrimbleMaps
import com.trimblemaps.mapsdk.camera.CameraPosition
import com.trimblemaps.mapsdk.geometry.LatLng
import com.trimblemaps.mapsdk.maps.MapView
import com.trimblemaps.mapsdk.maps.Style
import com.trimblemaps.mapsdk.style.layers.*
import com.trimblemaps.mapsdk.style.layers.PropertyFactory.*
import com.trimblemaps.mapsdk.style.sources.GeoJsonSource
import java.io.InputStream
import java.nio.charset.StandardCharsets.UTF_8
import java.util.*


class MapActivity : AppCompatActivity() {
    private lateinit var mapView: MapView

    private val lineSourceName = "lineSource"
    private val circleSourceName = "circleSource"
    private val polygonSourceName = "polygonSource"
    private val iconSourceName = "iconSource"
    private val iconID = "icon_fuel"

    private fun getBitmap(drawableRes: Int): Bitmap? {
        val drawable = resources.getDrawable(drawableRes)
        val canvas = Canvas()
        val bitmap = Bitmap.createBitmap(
            drawable.intrinsicWidth,
            drawable.intrinsicHeight,
            Bitmap.Config.ARGB_8888
        )
        canvas.setBitmap(bitmap)
        drawable.setBounds(0, 0, drawable.intrinsicWidth, drawable.intrinsicHeight)
        drawable.draw(canvas)
        return bitmap
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        TrimbleMaps.getInstance(this)
        setContentView(R.layout.activity_map)

        val position = CameraPosition.Builder()
            .target(LatLng(40.28116159249601, -74.67446208726132))
            .zoom(16.0)
            .build()

        val circleSource = GeoJsonSource(circleSourceName, loadJson("circle_source.json"))
        val lineSource = GeoJsonSource(lineSourceName, loadJson("line_source.json"))
        val polygonSource = GeoJsonSource(polygonSourceName, loadJson("polygon_source.json"))
        val iconSource = GeoJsonSource(iconSourceName, loadJson("icon_source.json"))

        mapView = findViewById(R.id.trimblemaps_mapView)
        mapView.onCreate(savedInstanceState)

        val fuelBitmap = getBitmap(R.drawable.trimblemaps_ic_amenity_fuel)

        mapView.getMapAsync { map ->
            map.setStyle(  Style.Builder()
                .fromUri(Style.MOBILE_DAY)
                .withSource(lineSource)
                .withLayer(LineLayer("1", lineSourceName)
                    .withProperties(lineColor(Color.BLUE), lineWidth(1.0f)))
                .withSource(circleSource)
                .withLayer(CircleLayer("2", circleSourceName)
                    .withProperties(circleRadius(10f), circleColor(Color.BLUE)))
                .withSource(polygonSource)
                .withLayer(FillLayer("3", polygonSourceName)
                    .withProperties(fillColor(Color.argb(100, 255, 0, 0))))
                .withImage(iconID, fuelBitmap!!)
                .withSource(iconSource)
                .withLayer(SymbolLayer("4", iconSourceName)
                    .withProperties(iconImage(iconID)))
            )
            map.cameraPosition = position
        }
    }

    private fun loadJson(filename: String): String? {
        val classLoader = javaClass.classLoader!!
        val inputStream: InputStream = classLoader.getResourceAsStream(filename)
        val scanner: Scanner = Scanner(inputStream, UTF_8.name()).useDelimiter("\\A")
        return if (scanner.hasNext()) scanner.next() else ""
    }
}
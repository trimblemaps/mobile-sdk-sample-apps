package com.trimblemaps.navigationexamples

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.trimblemaps.api.geocoding.v1.models.TrimbleMapsLocation
import com.trimblemaps.navigation.base.internal.extensions.LocaleEx.getUnitTypeForLocale
import com.trimblemaps.navigation.base.internal.extensions.inferDeviceLocale
import com.trimblemaps.navigation.core.TrimbleMapsNavigationProvider
import com.trimblemaps.navigation.core.TrimbleMapsTripProvider
import com.trimblemaps.navigation.core.trip.model.toTripStop
import com.trimblemaps.navigationexamples.databinding.ActivityMainBinding
import com.trimblemaps.navigationexamples.shared.Constants


class MainActivity : AppCompatActivity() {

    data class Example(val name: String, val image: Int, val activityToLaunch: Class<*>)
    val ActivityList = arrayOf(
        Example(Constants.VAN_NAVIGATION, R.drawable.van_nav_splash, NavigationActivity::class.java),
        Example(Constants.MULTI_STOP, R.drawable.general_splash, TripPreviewActivity::class.java),
        Example(Constants.HGV, R.drawable.van_nav_splash, TripPreviewActivity::class.java),
        Example(Constants.GENERAL, R.drawable.general_splash, AllInOneActivity::class.java),
        Example(Constants.HEADLESS_NAV, R.drawable.general_splash, HeadlessNavActivity::class.java
        )
    )

    private lateinit var binding: ActivityMainBinding


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.sampleList.apply {
            onItemClickListener = itemClickListener
            adapter = listAdapter
        }
    }

    private val itemClickListener = object : AdapterView.OnItemClickListener {
        override fun onItemClick(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
            this@MainActivity.run {
                TrimbleMapsNavigationProvider.destroy()
                TrimbleMapsTripProvider.destroy()
                val example = ActivityList[position]
                when (example.name) {
                    Constants.VAN_NAVIGATION -> TrimbleMapsTripProvider.create(). apply {
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.520783, -0.107835)
                            .placeName(Constants.CURRENT_LOCATION)
                            .build().toTripStop()
                        )
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.527070, -0.119449)
                            .placeName(Constants.DESTINATION)
                            .build().toTripStop()
                        )
                        options.apply {
                            routingProfile = Constants.MEDIUM_DUTY_STRAIGHT
                            language = inferDeviceLocale().language
                            voiceUnits = inferDeviceLocale().getUnitTypeForLocale()
                            alternatives = false
                        }
                    }
                    Constants.MULTI_STOP -> TrimbleMapsTripProvider.create(). apply {
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.452621, -0.141542)
                            .placeName(Constants.CURRENT_LOCATION)
                            .build().toTripStop()
                        )
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.452825, -0.138293)
                            .placeName("Stop 1")
                            .build().toTripStop()
                        )
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.455157, -0.135218)
                            .placeName("Stop 2")
                            .build().toTripStop()
                        )
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.456757, -0.133625)
                            .placeName("Stop 3")
                            .build().toTripStop()
                        )
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.459756, -0.134164)
                            .placeName("Stop 4")
                            .build().toTripStop()
                        )
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.459895, -0.136162)
                            .placeName("Stop 5")
                            .build().toTripStop()
                        )
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.460622, -0.137806)
                            .placeName("Stop 6")
                            .build().toTripStop()
                        )
                        addStop(TrimbleMapsLocation.builder()
                            .coords(51.461280, -0.136995)
                            .placeName("Stop 7")
                            .build().toTripStop()
                        )
                        options.apply {
                            routingProfile = Constants.MEDIUM_DUTY_STRAIGHT
                            language = inferDeviceLocale().language
                            voiceUnits = inferDeviceLocale().getUnitTypeForLocale()
                            alternatives = false
                        }
                    }
                    Constants.HGV -> TrimbleMapsTripProvider.create(). apply {
                        addStop(TrimbleMapsLocation.builder()
                            .coords(52.384709, 0.279140)
                            .placeName(Constants.CURRENT_LOCATION)
                            .build().toTripStop()
                        )
                        addStop(TrimbleMapsLocation.builder()
                            .coords(52.392261, 0.264782)
                            .placeName(Constants.DESTINATION)
                            .build().toTripStop()
                        )
                        options.apply {
                            routingProfile = Constants.HEAVY_DUTY_STRAIGHT
                            language = inferDeviceLocale().language
                            voiceUnits = inferDeviceLocale().getUnitTypeForLocale()
                            alternatives = false
                        }
                    }
                }
                startActivity(Intent(this, ActivityList[position].activityToLaunch))
            }
        }

    }

    private val listAdapter = object : BaseAdapter() {

        override fun getCount(): Int {
            return ActivityList.size
        }

        override fun getItem(position: Int): Any {
            return ActivityList[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {

            val rowView = convertView ?: run {
                val inflater = this@MainActivity
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
                inflater.inflate(R.layout.layout_sample_card, parent, false)
            }
            rowView.findViewById<TextView>(R.id.card_template_text)?.apply {
                text = ActivityList[position].name
            }
            rowView.findViewById<ImageView>(R.id.card_template_image)?.apply {
                if (ActivityList[position].image > 0)
                    setImageResource(ActivityList[position].image)
            }
            return rowView
        }

    }
}

package com.trimblemaps.mapssdkexampleskotlin

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.TextView
import com.trimblemaps.mapssdkexampleskotlin.shared.Constants
import com.trimblemaps.navigation.core.TrimbleMapsNavigationProvider
import com.trimblemaps.navigation.core.TrimbleMapsTripProvider
import com.trimblemaps.mapssdkexampleskotlin.databinding.ActivityMainBinding

class MainActivity : Activity() {


    data class Example(val name: String, val image: Int, val activityToLaunch: Class<*>)

    val ActivityList = arrayOf(
        Example(Constants.BASIC_MAP, R.drawable.van_nav_splash, SampleBasicMapActivity::class.java),
        Example(Constants.DATA_DRIVEN, R.drawable.general_splash, SampleDataDrivenStylingActivity::class.java),
        Example(Constants.DOTS, R.drawable.van_nav_splash, SampleDotsOnAMapActivity::class.java),
        Example(Constants.GEOCODING, R.drawable.general_splash, SampleGeocodingActivity::class.java),
        Example(Constants.LINES, R.drawable.van_nav_splash, SampleLinesOnAMapActivity::class.java),
        Example(Constants.SIMPLE_ROUTING, R.drawable.general_splash, SampleRoutingActivity::class.java),
        Example(Constants.FOLLOW_ME, R.drawable.van_nav_splash, SampleFollowMeActivity::class.java),
        Example(Constants.LAYERS, R.drawable.general_splash, SampleTrimbleLayersActivity::class.java),
        Example(Constants.MAP_STYLES, R.drawable.general_splash, SampleChangeStylesActivity::class.java)
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


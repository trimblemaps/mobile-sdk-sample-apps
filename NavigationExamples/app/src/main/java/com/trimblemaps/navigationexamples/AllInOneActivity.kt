package com.trimblemaps.navigationexamples

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.trimblemaps.navigation.ui.components.allinone.AllInOneViewOptions
import com.trimblemaps.navigation.ui.listeners.NavigationListener

import com.trimblemaps.navigationexamples.databinding.ActivityAllInOneBinding

class AllInOneActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAllInOneBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityAllInOneBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Create options and pass to all-in-one View
        val optionsBuilder = AllInOneViewOptions.builder(this).apply {
            navigationListener(navigationCallback)
            shouldSimulateRoute(true)
            enableVanishingRouteLine(true)
        }

        binding.allInOneView.apply {
            setAllInOneViewOptions(optionsBuilder.build())
            onCreate(savedInstanceState)
        }
    }

    // These are callbacks from the all-in-one navigation view
    private val navigationCallback = object : NavigationListener {
        override fun onCancelNavigation() {
            finish()
        }

        override fun onNavigationFinished() {
            finish()
        }

        override fun onNavigationRunning() {
            //
        }
    }

    public override fun onResume() {
        super.onResume()
        binding.allInOneView.onResume()
    }

    public override fun onPause() {
        super.onPause()
        binding.allInOneView.onPause()
    }

    override fun onStart() {
        super.onStart()
        binding.allInOneView.onStart()
    }

    override fun onStop() {
        super.onStop()
        binding.allInOneView.onStop()
    }

    override fun onLowMemory() {
        super.onLowMemory()
        binding.allInOneView.onLowMemory()
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.allInOneView.onDestroy()
    }
}
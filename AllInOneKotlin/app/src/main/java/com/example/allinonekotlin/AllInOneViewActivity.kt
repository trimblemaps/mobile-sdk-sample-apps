package com.example.allinonekotlin

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.trimblemaps.navigation.core.TrimbleMapsNavigationProvider
import com.trimblemaps.navigation.core.TrimbleMapsTripProvider
import com.trimblemaps.navigation.ui.components.allinone.AllInOneView
import com.trimblemaps.navigation.ui.components.allinone.AllInOneViewOptions
import com.trimblemaps.navigation.ui.listeners.NavigationListener

class AllInOneViewActivity : AppCompatActivity() {

    private lateinit var allInOneView: AllInOneView

    // These are callbacks from the all-in-one navigation view
    private val navigationCallback = object : NavigationListener {
        override fun onCancelNavigation() {
            finish()
            restartActivity()
        }

        override fun onNavigationFinished() {
            finish()
            restartActivity()
        }

        override fun onNavigationRunning() {
            //
        }
    }

    fun restartActivity() {
        overridePendingTransition(0, 0);
        startActivity(getIntent())
        overridePendingTransition(0, 0);
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_all_in_one_view)

        // Create options and pass to all-in-one view
        val optionsBuilder = AllInOneViewOptions.builder(this).apply {
            navigationListener(navigationCallback)
            shouldSimulateRoute(true)
            enableVanishingRouteLine(true)
        }

        allInOneView = findViewById<AllInOneView>(R.id.allInOneView).apply {
            setAllInOneViewOptions(optionsBuilder.build())
            onCreate(savedInstanceState)
        }
    }

    private var pressedTime: Long = 0
    override fun onBackPressed() {
        if (pressedTime + 2000 > System.currentTimeMillis()) {
            val intent = Intent(Intent.ACTION_MAIN)
            intent.addCategory(Intent.CATEGORY_HOME)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
        } else {
            Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show();
        }
        pressedTime = System.currentTimeMillis();
    }

    public override fun onResume() {
        super.onResume()
        allInOneView.onResume()
    }

    public override fun onPause() {
        super.onPause()
        allInOneView.onPause()
    }

    override fun onStart() {
        super.onStart()
        allInOneView.onStart()
    }

    override fun onStop() {
        super.onStop()
        allInOneView.onStop()
    }

    override fun onLowMemory() {
        super.onLowMemory()
        allInOneView.onLowMemory()
    }

    override fun onDestroy() {
        super.onDestroy()
        allInOneView.onDestroy()
        // Delete any existing instances of TrimbleMapsNavigation and TrimbleMapsTrip
        TrimbleMapsNavigationProvider.destroy()
        TrimbleMapsTripProvider.destroy()
    }
}
package com.example.allinonekotlin

import android.Manifest
import android.content.DialogInterface
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Gravity
import androidx.appcompat.app.AlertDialog
import androidx.core.content.ContextCompat
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.android.core.permissions.PermissionsListener
import com.trimblemaps.android.core.permissions.PermissionsManager
import com.trimblemaps.mapsdk.TrimbleMaps

class MainActivity : AppCompatActivity() {
    private val permissionsManager = PermissionsManager(null)
    private val permissionsListener = object: PermissionsListener {
        override fun onExplanationNeeded(permissionsToExplain: MutableList<String>?) {
        }

        override fun onPermissionResult(granted: Boolean) {
            if(granted && PermissionsManager.isAndroidElevenPlus() &&
                !PermissionsManager.areLocationPermissionsGranted(this@MainActivity)) {
                permissionsManager.requestBackgroundLocationPermissions(this@MainActivity)
            }
        }
    }

    private fun showLicensingAlert() {
        val alertDialog = AlertDialog.Builder(this@MainActivity)
            .setTitle("Provide an API key")
            .setMessage("In order to use the SDK's licensing is required.\nReach out to Trimble MAPS support.")
            .setPositiveButton("Ok", DialogInterface.OnClickListener { dialog, which ->
                dialog.dismiss()
                finish()
            })
            .create()

        alertDialog.window?.setGravity(Gravity.BOTTOM)
        alertDialog.show()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val account = TrimbleMapsAccount.builder()
            .apiKey("")
            .addLicensedFeature(LicensedFeature.NAVIGATION_SDK)
            .addLicensedFeature(LicensedFeature.MAPS_SDK)
            .build()

        TrimbleMapsAccountManager.initialize(account)
        TrimbleMapsAccountManager.awaitInitialization()

        if(!TrimbleMapsAccountManager.isLicensedForMaps() || !TrimbleMapsAccountManager.isLicensedForNavigation()) {
            showLicensingAlert()
        } else {
            TrimbleMaps.getInstance(applicationContext)

            if ((PermissionsManager.isAndroidElevenPlus() && ContextCompat.checkSelfPermission(this,
                    Manifest.permission.ACCESS_BACKGROUND_LOCATION
                ) == 0)
                || ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == 0) {
                startActivity(Intent(this, AllInOneViewActivity::class.java))
            }
            else {
                permissionsManager.listener = permissionsListener
                permissionsManager.requestLocationPermissions(this)
            }
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        permissionsManager.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if(PermissionsManager.isAndroidElevenPlus()) {
            if(permissions.isNotEmpty() && permissions.contains(Manifest.permission.ACCESS_BACKGROUND_LOCATION)) {
                startActivity(Intent(this, AllInOneViewActivity::class.java))
            }
        } else if (permissions.isNotEmpty() && permissions.contains(Manifest.permission.ACCESS_FINE_LOCATION)) {
            startActivity(Intent(this, AllInOneViewActivity::class.java))
        }
    }
}
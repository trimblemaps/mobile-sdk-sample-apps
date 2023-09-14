package com.trimblemaps.maplayerskotlin

import android.content.DialogInterface
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Gravity
import androidx.appcompat.app.AlertDialog
import com.trimblemaps.account.LicensedFeature
import com.trimblemaps.account.TrimbleMapsAccountManager
import com.trimblemaps.account.models.TrimbleMapsAccount
import com.trimblemaps.mapsdk.TrimbleMaps

class MainActivity : AppCompatActivity() {

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
            .addLicensedFeature(LicensedFeature.MAPS_SDK)
            .build()

        TrimbleMapsAccountManager.initialize(account)
        TrimbleMapsAccountManager.awaitInitialization()

        if(!TrimbleMapsAccountManager.isLicensedForMaps()) {
            showLicensingAlert()
        } else {
            TrimbleMaps.getInstance(applicationContext)
            startActivity(Intent(this, MapActivity::class.java))
        }
    }
}
package com.example.allinonejava;

import android.Manifest;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import com.trimblemaps.account.LicensedFeature;
import com.trimblemaps.account.TrimbleMapsAccountManager;
import com.trimblemaps.account.models.TrimbleMapsAccount;
import com.trimblemaps.android.core.permissions.PermissionsListener;
import com.trimblemaps.android.core.permissions.PermissionsManager;
import com.trimblemaps.mapsdk.TrimbleMaps;
import kotlin.collections.ArraysKt;
import kotlin.jvm.internal.Intrinsics;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.List;

public final class MainActivity extends AppCompatActivity {

    private final PermissionsManager permissionsManager = new PermissionsManager(null);
    private final PermissionsListener permissionsListener = new PermissionsListener() {
        @Override
        public void onExplanationNeeded(List<String> permissionsToExplain) {
        }

        @Override
        public void onPermissionResult(boolean granted) {
            if (granted && PermissionsManager.isAndroidElevenPlus() && !PermissionsManager.areLocationPermissionsGranted(MainActivity.this)) {
                permissionsManager.requestBackgroundLocationPermissions(MainActivity.this);
            }
        }
    };

    private void showLicensingAlert() {
        AlertDialog alertDialog = new AlertDialog.Builder(this)
                .setTitle("Provide an API key")
                .setMessage("In order to use the SDK's licensing is required.\nReach out to Trimble MAPS support.")
                .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                    @Override public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                        finish();
                    }})
                .create();

        alertDialog.getWindow().setGravity(Gravity.BOTTOM);
        alertDialog.show();
    }

    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_main);

        TrimbleMapsAccount account = TrimbleMapsAccount.builder()
                .apiKey("")
                .addLicensedFeature(LicensedFeature.NAVIGATION_SDK)
                .addLicensedFeature(LicensedFeature.MAPS_SDK)
                .build();

        TrimbleMapsAccountManager.initialize(account);
        TrimbleMapsAccountManager.awaitInitialization();

        if(!TrimbleMapsAccountManager.isLicensedForMaps() || !TrimbleMapsAccountManager.isLicensedForNavigation()) {
            showLicensingAlert();
        } else {
            TrimbleMaps.getInstance(this.getApplicationContext());

            if ((!PermissionsManager.isAndroidElevenPlus() ||
                    ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != 0) &&
                    ContextCompat.checkSelfPermission((Context)this, Manifest.permission.ACCESS_FINE_LOCATION) != 0) {
                this.permissionsManager.setListener(permissionsListener);
                this.permissionsManager.requestLocationPermissions(this);
            } else {
                this.startActivity(new Intent(this, AllInOneViewActivity.class));
            }
        }
    }

    public void onRequestPermissionsResult(int requestCode, @NotNull String[] permissions, @NotNull int[] grantResults) {
        Intrinsics.checkNotNullParameter(permissions, "permissions");
        Intrinsics.checkNotNullParameter(grantResults, "grantResults");
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (PermissionsManager.isAndroidElevenPlus()) {
            if (ArraysKt.contains(permissions, Manifest.permission.ACCESS_FINE_LOCATION) &&
                    !PermissionsManager.areLocationPermissionsGranted(MainActivity.this)) {
                permissionsManager.requestBackgroundLocationPermissions(MainActivity.this);
            }
            else if (ArraysKt.contains(permissions, Manifest.permission.ACCESS_BACKGROUND_LOCATION)) {
                this.startActivity(new Intent((Context)this, AllInOneViewActivity.class));
            }
        } else if (permissions.length != 0 && ArraysKt.contains(permissions, Manifest.permission.ACCESS_FINE_LOCATION)) {
            this.startActivity(new Intent((Context)this, AllInOneViewActivity.class));
        }
    }
}

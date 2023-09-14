package com.example.allinonejava;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.trimblemaps.navigation.core.TrimbleMapsNavigationProvider;
import com.trimblemaps.navigation.core.TrimbleMapsTripProvider;
import com.trimblemaps.navigation.ui.components.allinone.AllInOneView;
import com.trimblemaps.navigation.ui.components.allinone.AllInOneViewOptions;
import com.trimblemaps.navigation.ui.listeners.NavigationListener;
import org.jetbrains.annotations.Nullable;


public final class AllInOneViewActivity extends AppCompatActivity {
    private AllInOneView allInOneView;
    private final NavigationListener navigationCallback = new NavigationListener() {
        public void onCancelNavigation() {
            finish();
            restartActivity();
        }

        public void onNavigationFinished() {
            finish();
            restartActivity();
        }

        public void onNavigationRunning() {
        }
    };

    public final void restartActivity() {
        this.overridePendingTransition(0, 0);
        this.startActivity(getIntent());
        this.overridePendingTransition(0, 0);
    }

    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_all_in_one_view);

        AllInOneViewOptions options =  AllInOneViewOptions.builder(this)
                .navigationListener(navigationCallback)
                .shouldSimulateRoute(true)
                .enableVanishingRouteLine(true)
                .build();

        allInOneView = findViewById(R.id.allInOneView);
        allInOneView.setAllInOneViewOptions(options);
        allInOneView.onCreate(savedInstanceState);
    }

    private long pressedTime;
    public void onBackPressed() {
        if (pressedTime + 2000 > System.currentTimeMillis()) {
            Intent intent = new Intent("android.intent.action.MAIN");
            intent.addCategory("android.intent.category.HOME");
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
            finish();
        } else {
            Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show();
        }

        pressedTime = System.currentTimeMillis();
    }

    public void onResume() {
        super.onResume();
        allInOneView.onResume();
    }

    public void onPause() {
        super.onPause();
        allInOneView.onPause();
    }

    protected void onStart() {
        super.onStart();
        allInOneView.onStart();
    }

    protected void onStop() {
        super.onStop();
        allInOneView.onStop();
    }

    public void onLowMemory() {
        super.onLowMemory();
        allInOneView.onLowMemory();
    }

    protected void onDestroy() {
        super.onDestroy();
        allInOneView.onDestroy();
    }
}

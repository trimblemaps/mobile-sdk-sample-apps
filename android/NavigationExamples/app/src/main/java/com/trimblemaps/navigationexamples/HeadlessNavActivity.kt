package com.trimblemaps.navigationexamples

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.trimblemaps.api.directions.v1.models.BannerInstructions
import com.trimblemaps.api.directions.v1.models.DirectionsResponse
import com.trimblemaps.api.directions.v1.models.VoiceInstructions
import com.trimblemaps.api.geocoding.v1.models.TrimbleMapsLocation
import com.trimblemaps.navigation.base.options.NavigationOptions
import com.trimblemaps.navigation.base.trip.model.RouteLegProgress
import com.trimblemaps.navigation.base.trip.model.RouteProgress
import com.trimblemaps.navigation.core.TrimbleMapsNavigation
import com.trimblemaps.navigation.core.TrimbleMapsNavigationProvider
import com.trimblemaps.navigation.core.TrimbleMapsTrip
import com.trimblemaps.navigation.core.TrimbleMapsTripProvider
import com.trimblemaps.navigation.core.arrival.ArrivalObserver
import com.trimblemaps.navigation.core.trip.model.TripStop
import com.trimblemaps.navigation.core.trip.session.BannerInstructionsObserver
import com.trimblemaps.navigation.core.trip.session.LocationObserver
import com.trimblemaps.navigation.core.trip.session.OffRouteObserver
import com.trimblemaps.navigation.core.trip.session.RouteProgressObserver
import com.trimblemaps.navigation.core.trip.session.VoiceInstructionsObserver
import com.trimblemaps.navigation.core.internal.formatter.TrimbleMapsDistanceFormatter
import com.trimblemaps.navigation.core.replay.TrimbleMapsReplayer
import com.trimblemaps.navigation.core.replay.ReplayLocationEngine
import com.trimblemaps.navigation.core.replay.route.ReplayProgressObserver
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

/**
 * Headless Navigation Activity demonstrating how to use the Navigation SDK
 * without the built-in UI components, allowing for complete UI customization.
 *
 * This example shows:
 * - Route progress monitoring (distance, duration, turn arrows)
 * - Voice instruction handling for TTS
 * - Banner instruction handling for turn cards
 * - Off-route detection
 * - Enhanced location updates (road-snapped)
 * - Arrival detection for waypoints and final destination
 */
@OptIn(ExperimentalMaterial3Api::class)
class HeadlessNavActivity : ComponentActivity() {
    private lateinit var navManager: NavigationManagerSkeleton

    // Sample coordinates for demonstration - Princeton, NJ area
    private var originLat: Double = 40.361279
    private var originLon: Double = -74.600697
    private var destinationLat: Double = 40.349542
    private var destinationLon: Double = -74.660237

    // Observable state for UI updates
    private var statusText by mutableStateOf("Initializing navigation...")
    private var distanceRemaining by mutableStateOf("--")
    private var timeRemaining by mutableStateOf("--")
    private var currentInstruction by mutableStateOf("--")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    HeadlessNavScreen(
                        statusText = statusText,
                        distanceRemaining = distanceRemaining,
                        timeRemaining = timeRemaining,
                        currentInstruction = currentInstruction,
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }

        // Initialize navigation manager
        navManager = NavigationManagerSkeleton(
            context = this,
            onStatusUpdate = { statusText = it },
            onDistanceUpdate = { distanceRemaining = it },
            onTimeUpdate = { timeRemaining = it },
            onInstructionUpdate = { currentInstruction = it }
        )

        // Create and configure the trip
        val trimbleMapsTrip = TrimbleMapsTripProvider.create()
        trimbleMapsTrip.addStop(
            TripStop(
                TrimbleMapsLocation.builder()
                    .coords(originLat, originLon)
                    .placeName("Origin")
                    .build()
            )
        )

        trimbleMapsTrip.addStop(
            TripStop(
                TrimbleMapsLocation.builder()
                    .coords(destinationLat, destinationLon)
                    .placeName("Destination")
                    .build()
            )
        )

        navManager.startTrip(trimbleMapsTrip)
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::navManager.isInitialized) {
            navManager.onDestroy()
        }
    }
}

@Composable
fun HeadlessNavScreen(
    statusText: String,
    distanceRemaining: String,
    timeRemaining: String,
    currentInstruction: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Headless Navigation Demo",
            style = MaterialTheme.typography.headlineMedium,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(32.dp))

        Text(
            text = statusText,
            style = MaterialTheme.typography.bodyLarge,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Distance Remaining: $distanceRemaining",
            style = MaterialTheme.typography.bodyMedium
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Time Remaining: $timeRemaining",
            style = MaterialTheme.typography.bodyMedium
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Current Instruction:",
            style = MaterialTheme.typography.labelLarge
        )

        Text(
            text = currentInstruction,
            style = MaterialTheme.typography.bodyMedium,
            textAlign = TextAlign.Center
        )
    }
}

/**
 * Navigation Manager that handles all navigation SDK interactions.
 * This skeleton demonstrates the callback structure without relying on UI components.
 */
class NavigationManagerSkeleton(
    private val context: Context,
    private val onStatusUpdate: (String) -> Unit = {},
    private val onDistanceUpdate: (String) -> Unit = {},
    private val onTimeUpdate: (String) -> Unit = {},
    private val onInstructionUpdate: (String) -> Unit = {}
) {
    private val navigation: TrimbleMapsNavigation

    // Simulation components
    private val trimbleMapsReplayer = TrimbleMapsReplayer()
    private val replayLocationEngine = ReplayLocationEngine(trimbleMapsReplayer)

    companion object {
        private const val TAG = "HeadlessNavSkeleton"
    }

    init {
        val options = NavigationOptions.Builder(context)
            .isFromNavigationUi(false)
            .distanceFormatter(TrimbleMapsDistanceFormatter.Builder(context).build())
            .locationEngine(replayLocationEngine)
            .build()

        navigation = TrimbleMapsNavigationProvider.create(options)
        setupObservers()
    }

    /**
     * Start the navigation trip by fetching the route and beginning the session.
     */
    @SuppressLint("MissingPermission")
    fun startTrip(trimbleMapsTrip: TrimbleMapsTrip) {
        onStatusUpdate("Fetching route...")

        val routeResponseCallback = object : Callback<DirectionsResponse> {
            override fun onResponse(call: Call<DirectionsResponse>, response: Response<DirectionsResponse>) {
                val body = response.body()
                if (body == null) {
                    Log.e(TAG, "Route response body is null")
                    onStatusUpdate("Error: Route response is null")
                    return
                }

                val routes = body.routes()
                if (routes.isNullOrEmpty()) {
                    Log.e(TAG, "No routes returned from directions API")
                    onStatusUpdate("Error: No routes found")
                    return
                }

                navigation.setTrip(trimbleMapsTrip)
                navigation.startTripSession()

                // Use ReplayProgressObserver to auto-feed route geometry as navigation progresses
                navigation.registerRouteProgressObserver(ReplayProgressObserver(trimbleMapsReplayer))

                // Set playback speed and start simulation
                val simulationSpeedMultiplier = 2.0
                trimbleMapsReplayer.playbackSpeed(simulationSpeedMultiplier)
                trimbleMapsReplayer.play()

                Log.d(TAG, "Simulation started at ${simulationSpeedMultiplier}x speed")
                onStatusUpdate("Simulating at ${simulationSpeedMultiplier}x speed")
            }

            override fun onFailure(call: Call<DirectionsResponse>, t: Throwable) {
                Log.e(TAG, "Route fetch failed: ${t.message}")
                onStatusUpdate("Error: ${t.message}")
            }
        }
        trimbleMapsTrip.fetchFullRoute(routeResponseCallback)
    }

    /**
     * Setup all navigation observers for receiving updates.
     */
    private fun setupObservers() {
        // A. ROUTE PROGRESS (Metrics, ETA, Distance, Turn Arrows)
        navigation.registerRouteProgressObserver(object : RouteProgressObserver {
            override fun onRouteProgressChanged(routeProgress: RouteProgress) {
                val distanceRemaining = routeProgress.distanceRemaining
                val durationRemaining = routeProgress.durationRemaining

                Log.d(TAG, "Distance Left: ${distanceRemaining}m")
                Log.d(TAG, "Time Left: ${durationRemaining}s")

                onDistanceUpdate("%.1f km".format(distanceRemaining / 1000.0))
                onTimeUpdate("%.0f min".format(durationRemaining / 60.0))

                // Turn arrow information
                val currentLegProgress = routeProgress.currentLegProgress
                val upcomingStep = currentLegProgress?.upcomingStep

                if (upcomingStep != null) {
                    val maneuver = upcomingStep.maneuver()
                    val location = maneuver.location()
                    val type = maneuver.type()
                    val modifier = maneuver.modifier()

                    Log.d(TAG, "Draw Arrow At: ${location.latitude()}, ${location.longitude()}")
                    Log.d(TAG, "Arrow Type: $type ($modifier)")
                }
            }
        })

        // B. VOICE INSTRUCTIONS (TTS)
        navigation.registerVoiceInstructionsObserver(object : VoiceInstructionsObserver {
            override fun onNewVoiceInstructions(voiceInstructions: VoiceInstructions) {
                val textToSpeak = voiceInstructions.announcement()
                Log.d(TAG, "TTS Trigger: $textToSpeak")
                // Integrate with TTS engine here:
                // ttsEngine?.speak(textToSpeak, TextToSpeech.QUEUE_FLUSH, null, "nav_id")
            }
        })

        // C. BANNER INSTRUCTIONS (Turn Cards)
        navigation.registerBannerInstructionsObserver(object : BannerInstructionsObserver {
            override fun onNewBannerInstructions(bannerInstructions: BannerInstructions) {
                val primary = bannerInstructions.primary()
                val secondary = bannerInstructions.secondary()

                val instructionText = primary.text()
                val iconType = primary.type()
                val iconModifier = primary.modifier()

                Log.d(TAG, "Visual Instruction: $instructionText")
                Log.d(TAG, "Icon Code: $iconType / $iconModifier")

                onInstructionUpdate(instructionText)

                if (secondary != null) {
                    Log.d(TAG, "Secondary Info: ${secondary.text()}")
                }
            }
        })

        // D. OFF ROUTE DETECTION
        navigation.registerOffRouteObserver(object : OffRouteObserver {
            override fun onOffRouteStateChanged(offRoute: Boolean) {
                if (offRoute) {
                    Log.w(TAG, "User is Off-Route! Initiating reroute logic...")
                    onStatusUpdate("Off route - rerouting...")
                }
            }
        })

        // E. LOCATION / PUCK UPDATES (Enhanced/snapped location)
        navigation.registerLocationObserver(object : LocationObserver {
            override fun onEnhancedLocationChanged(
                enhancedLocation: Location,
                keyPoints: List<Location>
            ) {
                Log.d(TAG, "Snapped Location: ${enhancedLocation.latitude}, ${enhancedLocation.longitude}")
                Log.d(TAG, "Snapped Bearing: ${enhancedLocation.bearing}")
            }

            override fun onRawLocationChanged(rawLocation: Location) {
                Log.v(TAG, "Raw GPS: ${rawLocation.latitude}, ${rawLocation.longitude}")
            }
        })

        // F. ARRIVAL DETECTION
        navigation.registerArrivalObserver(object : ArrivalObserver {
            override fun onFinalDestinationArrival(routeProgress: RouteProgress) {
                Log.d(TAG, "You have arrived at your final destination!")
                onStatusUpdate("You have arrived!")
            }

            override fun onIntermediateArrival(routeLegProgress: RouteLegProgress) {
                Log.d(TAG, "You have arrived at an intermediate stop!")
                onStatusUpdate("You have arrived at an intermediate stop!")
            }

            override fun onNextRouteLegStart(routeLegProgress: RouteLegProgress) {
                Log.d(TAG, "Starting leg ${routeLegProgress.legIndex + 1}")
                onStatusUpdate("Starting next leg")
            }
        })
    }

    /**
     * Cleanup - must be called to prevent memory leaks.
     */
    fun onDestroy() {
        trimbleMapsReplayer.finish()
        navigation.stopTripSession()
        navigation.onDestroy()
        Log.d(TAG, "Navigation Destroyed")
    }
}


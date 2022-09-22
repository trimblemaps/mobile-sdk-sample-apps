package com.trimblemaps.navigationexamples.shared

import com.trimblemaps.api.routingprofiles.v1.models.Profile

object Constants {

    private val DEFAULT_RATING_PROFILE_JSON = """{"name":"Default Rating","vehicleType":"Heavy Duty","units":0,"vehicleOptions":{
        |"vehicleConfig":{"height":162.0,"width":96.0,"length":576.0,"weight":80000.0,"maxWeightPerAxleGroup":34000.0},"hazmatType":0},
        |"routingOptions":{"ferries":0,"routeType":0,"tollRoads":3,"useOpenBorders":true,"useStateAndNationalNetwork":false,"elevationLimit":7500},
        |"copilotOptions":{"displayRestrictions":2}
        |}""".trimMargin()
    val DEFAULT_RATING_PROFILE = Profile.fromJson(DEFAULT_RATING_PROFILE_JSON)

    private val HEAVY_DUTY_STRAIGHT_JSON = """{"name":"Heavy Duty Straight","vehicleType":"Heavy Duty","units":0,"vehicleOptions":{
        |"vehicleConfig":{"height":162.0,"width":96.0,"length":480.0,"weight":45000.0,"maxWeightPerAxleGroup":34000.0},"hazmatType":0},
        |"routingOptions":{"ferries":0,"routeType":0,"tollRoads":3,"useOpenBorders":true,"useStateAndNationalNetwork":false,"elevationLimit":7500},
        |"copilotOptions":{"displayRestrictions":2}
        |}""".trimMargin()
    val HEAVY_DUTY_STRAIGHT = Profile.fromJson(HEAVY_DUTY_STRAIGHT_JSON)

    private val MEDIUM_DUTY_STRAIGHT_JSON = """{"name":"Medium Duty Straight","vehicleType":"Medium Duty","units":0,"vehicleOptions":{
        |"vehicleConfig":{"height":162.0,"width":96.0,"length":312.0,"weight":26000.0,"maxWeightPerAxleGroup":19000.0},"hazmatType":0},
        |"routingOptions":{"ferries":0,"routeType":0,"tollRoads":3,"useOpenBorders":true,"elevationLimit":7500},
        |"copilotOptions":{"displayRestrictions":2}
        |}""".trimMargin()
    val MEDIUM_DUTY_STRAIGHT = Profile.fromJson(MEDIUM_DUTY_STRAIGHT_JSON)

    private val FULL_VAN_JSON = """{"name":"Full-size Van","vehicleType":"Auto","units":0,
        |"routingOptions":{"ferries":0,"routeType":0,"tollRoads":3,"useOpenBorders":true}
        |}""".trimMargin()
    val FULL_VAN = Profile.fromJson(FULL_VAN_JSON)

    const val CURRENT_LOCATION = "Current Location"
    const val DESTINATION = "Destination"
    const val VAN_NAVIGATION = "VAN NAVIGATION"
    const val MULTI_STOP = "MULTI STOP"
    const val HGV = "HGV"
    const val GENERAL = "General"
}
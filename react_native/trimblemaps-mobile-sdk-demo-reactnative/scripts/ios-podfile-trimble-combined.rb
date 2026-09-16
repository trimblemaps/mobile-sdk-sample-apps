# Shared Podfile helpers for apps that combine maps, plugins, account, and services.

def trimble_carthage_build_path
  install_root = Pod::Config.instance.installation_root
  File.expand_path("../Carthage/Build", install_root)
end

def trimble_app_root
  File.expand_path("..", Pod::Config.instance.installation_root)
end

def trimble_services_pod_root
  File.join(trimble_app_root, "node_modules/@trimblemaps/services-react-native")
end

def trimble_shared_framework_search_paths
  paths = [
    "${PODS_XCFRAMEWORKS_BUILD_DIR}/TrimbleMapsPluginsReactNative",
    "${PODS_XCFRAMEWORKS_BUILD_DIR}/TrimbleMapsReactNative",
    "\"#{trimble_carthage_build_path}\"",
    "\"#{File.join(trimble_carthage_build_path, 'iOS')}\"",
  ]

  trimble_xcframework_slice_search_paths(trimble_carthage_build_path).each do |slice_dir|
    paths << "\"#{slice_dir}\""
  end

  paths
end

SERVICES_SHARED_XCFRAMEWORKS = [
  "TrimbleMapsWebservicesClient",
  "TrimbleMapsMobileEvents",
  "Polyline",
  "Turf",
].freeze unless defined?(SERVICES_SHARED_XCFRAMEWORKS)

def trimble_xcframework_slices(carthage_build)
  {
    simulator: "ios-arm64_x86_64-simulator",
    device: "ios-arm64",
  }.transform_values do |slice|
    SERVICES_SHARED_XCFRAMEWORKS.filter_map do |name|
      slice_dir = File.join(carthage_build, "#{name}.xcframework", slice)
      slice_dir if File.directory?(File.join(slice_dir, "#{name}.framework"))
    end
  end
end

def trimble_xcframework_slice_search_paths(carthage_build)
  trimble_xcframework_slices(carthage_build).values.flatten.uniq
end

def trimble_xcframework_swift_flags(carthage_build, platform)
  trimble_xcframework_slices(carthage_build)[platform]
    .map { |slice_dir| "-F\"#{slice_dir}\"" }
    .join(" ")
end

def trimble_strip_services_vendored_frameworks!(specifications)
  specifications.each do |spec|
    next unless spec.name == "TrimbleMapsServicesReactNative"

    spec.attributes_hash.delete("vendored_frameworks")
    spec.root_spec.attributes_hash.delete("vendored_frameworks") if spec.respond_to?(:root_spec)
  end
end

def trimble_add_services_pod_dependencies!(specifications)
  specifications.each do |spec|
    next unless spec.name == "TrimbleMapsServicesReactNative"

    unless spec.dependencies.any? { |dependency| dependency.name == "TrimbleMapsPluginsReactNative" }
      spec.dependencies << Pod::Dependency.new("TrimbleMapsPluginsReactNative")
    end
  end
end

def trimble_configure_services_pod_compilation!(installer)
  framework_search_paths = trimble_shared_framework_search_paths
  carthage_build = trimble_carthage_build_path
  simulator_swift_flags = trimble_xcframework_swift_flags(carthage_build, :simulator)
  device_swift_flags = trimble_xcframework_swift_flags(carthage_build, :device)

  installer.pods_project.targets.each do |target|
    next unless target.name == "TrimbleMapsServicesReactNative"

    target.build_configurations.each do |config|
      config.build_settings["FRAMEWORK_SEARCH_PATHS"] ||= "$(inherited)"
      framework_search_paths.each do |framework_path|
        normalized = framework_path.delete('"')
        next if config.build_settings["FRAMEWORK_SEARCH_PATHS"].to_s.include?(normalized)

        config.build_settings["FRAMEWORK_SEARCH_PATHS"] << " #{framework_path}"
      end

      config.build_settings["OTHER_SWIFT_FLAGS"] ||= "$(inherited)"
      unless config.build_settings["OTHER_SWIFT_FLAGS"].to_s.include?("-Xcc -stdlib=libc++")
        config.build_settings["OTHER_SWIFT_FLAGS"] << " -Xcc -stdlib=libc++"
      end

      if simulator_swift_flags && !simulator_swift_flags.empty?
        config.build_settings["OTHER_SWIFT_FLAGS[sdk=iphonesimulator*]"] ||= "$(inherited)"
        unless config.build_settings["OTHER_SWIFT_FLAGS[sdk=iphonesimulator*]"].to_s.include?("-F\"")
          config.build_settings["OTHER_SWIFT_FLAGS[sdk=iphonesimulator*]"] << " #{simulator_swift_flags}"
        end
      end

      if device_swift_flags && !device_swift_flags.empty?
        config.build_settings["OTHER_SWIFT_FLAGS[sdk=iphoneos*]"] ||= "$(inherited)"
        unless config.build_settings["OTHER_SWIFT_FLAGS[sdk=iphoneos*]"].to_s.include?("-F\"")
          config.build_settings["OTHER_SWIFT_FLAGS[sdk=iphoneos*]"] << " #{device_swift_flags}"
        end
      end
    end
  end
end

def trimble_run_combined_post_install(installer)
  $RNTM.post_install(installer) if defined?($RNTM) && $RNTM
  $RNTM_CORE.post_install(installer) if defined?($RNTM_CORE) && $RNTM_CORE
  $RNTP.post_install(installer) if defined?($RNTP) && $RNTP
  $RNTM_SERVICES.post_install(installer) if defined?($RNTM_SERVICES) && $RNTM_SERVICES
  trimble_configure_services_pod_compilation!(installer)
end

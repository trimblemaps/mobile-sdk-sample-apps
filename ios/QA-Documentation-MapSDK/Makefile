export NCPU := $(shell sysctl -n hw.ncpu)
export JOBS ?= $(shell expr $(NCPU) - 1)
export XCPRETTY ?= | tee '$(CURDIR)/build/xcodebuild-$(shell date +"%Y-%m-%d_%H%M%S").log' | xcpretty && exit ${PIPESTATUS[0]}
export BUILD_VERSION := $(shell ./get_version.sh)

APP = QADocumentationDemoApp
BUILD_SCHEME ?= QA-Documentation-MapSDK
IOS_OUTPUT_PATH = build/ios
IOS_PROJ_PATH = QA-Documentation-MapSDK.xcodeproj

IOS_XCODEBUILD_ARCHIVE = set -o pipefail && \
                xcodebuild archive \
                -scheme "$(BUILD_SCHEME)" \
                -project $(IOS_PROJ_PATH) \
                -jobs $(JOBS) \

$(IOS_OUTPUT_PATH):
	mkdir -p $@

.PHONY: build-version
build-version:
	@echo $(BUILD_VERSION)

.PHONY: cleanLogs
cleanLogs:
	rm -rf build/xcodebuild-*.log

.PHONY: archive
archive: $(IOS_OUTPUT_PATH) cleanLogs
	rm -rf $(IOS_OUTPUT_PATH)/* \
	$(IOS_XCODEBUILD_ARCHIVE) -destination "generic/platform=iOS" \
	-archivePath $(IOS_OUTPUT_PATH)/$(APP) \
	$(XCPRETTY)

EXPORT_STYLES = adhoc distrib

exportIPA_%:
	@echo "Exporting $*"
	xcodebuild -exportArchive \
	-archivePath $(IOS_OUTPUT_PATH)/$(APP).xcarchive \
	-exportPath $(IOS_OUTPUT_PATH)/$(APP)/$* \
	-exportOptionsPlist export_$*.plist

.PHONY: exportIPA
exportIPA: $(addprefix exportIPA_,$(EXPORT_STYLES))
	@echo "Finished exporting $@..."

# This will be needed when appcenter crash logs are integrated
# .PHONY: packageDsym
# packageDsym:
#       rm -f $(IOS_OUTPUT_PATH)/$(APP)/$(BUILD_SCHEME).app.dSYMs.zip
#       cd $(IOS_OUTPUT_PATH)/$(APP).xcarchive; \
#       zip -vr ../$(APP)/$(BUILD_SCHEME).app.dSYMs.zip dSYMs

# .PHONY: publishSymbols
# publishSymbols:
#       appcenter crashes upload-symbols --disable-telemetry \
#       --token $(APPCENTER_TOKEN) \
#       --app $(APPCENTER_ORGANIZATION)/$(APPCENTER_APP_NAME) \
#       --xcarchive $(IOS_OUTPUT_PATH)/$(APP).xcarchive

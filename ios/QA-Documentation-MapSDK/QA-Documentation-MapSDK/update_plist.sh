LAST_TAG=$(git describe --first-parent @)
regex="^(.*)-([0-9.]*)(-([0-9.]*)-g.{4,})?$"

if [[ $LAST_TAG =~ $regex ]]
then
        RELEASE_VERSION="${BASH_REMATCH[2]}"
        BUILD_NUMBER="${BASH_REMATCH[4]:-0}"
else
        RELEASE_VERSION="1.0"
        BUILD_NUMBER="0"
fi

echo "CFBundleShortVersionString: ${RELEASE_VERSION}"
echo "CFBundleVersion: ${BUILD_NUMBER}"
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${RELEASE_VERSION}" "Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "Info.plist"

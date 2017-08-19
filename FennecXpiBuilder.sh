# Run this script from your project base dir.

#1 - Complete the following vars:
#ANDROID_APP_ID=org.mozilla.fennec_aurora;
ANDROID_APP_ID=org.mozilla.fennec;
#ANDROID_APP_ID=org.mozilla.firefox_beta;
#ANDROID_APP_ID=org.mozilla.firefox;
APP_NAME="MoWA";
PHONE_DIR="mowa";
OUTPUT_DIR=$HOME;
FILES="./";
EXCLUDE="-xr!./.git -xr!./tmp";
CLEAN_APP_DATA=false;

#2 - This will clear all your app cache
if [ "$CLEAN_APP_DATA" == "true" ]; then
	adb shell pm clear $ANDROID_APP_ID
fi

#3 - This will create the XPI file
7z a -r $OUTPUT_DIR/$APP_NAME.xpi $FILES $EXCLUDE;

#4 - This will copy the XPI to the phone SD card. Don't worry if you don't have SD card, it will be copied to a directory called /sdcard
adb push $OUTPUT_DIR/$APP_NAME.xpi /sdcard/$PHONE_DIR/$APP_NAME.xpi;

#Open the folder, so you can click on the extension to be installed
adb shell am start -a android.intent.action.VIEW -c android.intent.category.DEFAULT -d file:///mnt/sdcard/$PHONE_DIR/ -n $ANDROID_APP_ID/.App;

#Until v42, it was possible to automatically load the file... Not now
#5 - This will start the Firefox App with the XPI to install
#adb shell am start -a android.intent.action.VIEW -c android.intent.category.DEFAULT -d file:///mnt/sdcard/$PHONE_DIR/$APP_NAME.xpi -n $ANDROID_APP_ID/.App;

#6 - Redirect tcp to watch via console
#adb forward tcp:6000 tcp:6000; #For Firefox for Android 34 and earlier
adb forward tcp:6000 localfilesystem:/data/data/$ANDROID_APP_ID/firefox-debugger-socket #For Firefox for Android 35 and later

#7 - This will wait to you to test your addon and press any key to close Firefox.
echo ""; read -p "Press 'r' to restart or any other key to close the browser..." pressedKey;

if [ "$pressedKey" == "r" ]; then
    adb shell am force-stop $ANDROID_APP_ID;

	#8 - This will remove the XPI from the filesystem (but it's still copied on your Firefox)
	adb shell rm /sdcard/$PHONE_DIR/$APP_NAME.xpi
	rm $OUTPUT_DIR/$APP_NAME.xpi;
	echo "Firefox has been forced to stop. Restarting...";
	adb shell am start -a android.intent.action.VIEW -c android.intent.category.DEFAULT -n $ANDROID_APP_ID/.App;

	echo ""; read -p "Test your addon on mobile. Press any key to close app...";
fi

adb shell am force-stop $ANDROID_APP_ID;
adb shell rm /sdcard/$PHONE_DIR/$APP_NAME.xpi
rm $OUTPUT_DIR/$APP_NAME.xpi;
echo "Firefox has been forced to stop. Restarting...";

exit 0;

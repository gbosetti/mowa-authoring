# About the project #
MoWA authoring is an EUD approach and supporting tool built on the foundations of MoWA, a framework allowing developers to create diverse kinds of Mobile Web applications (as Context Aware or Mobile Hypermedia) that extend existing ‒and usually third party‒ Web applications with augmentations adaptive to the user’s context. MoWA authoring empowers end users to create MoWA applications through a form-based process combined with composable visual widgets and live programming.

## This repo contains: ##
Js files at src/ level are high privileged code. 
Files in src/chrome/ are low level code. 
The main file is bootstrap.js

## Getting started ##
Instructions in this sections are explained for Ubuntu users. However, you can adapt each step to all operating systems that support the execution of Firefox and ADB. It is also possible to dispense with ADB, but for simplicity and flexibility for the developer, this guide explains how to set-up the environment for this project using such tool.

### System Requirements ###

* Firefox 54 in your desktop environment*. sudo apt-get install firefox
* 7Zip, a utility for compressing files. sudo apt-get p7zip-full
* ADB, the Android Debug Bridge. sudo apt-get install android-tools-adb
* Bower, for managing the third-party dependencies. You need to have npm installed. npm install -g bower
* Firefox for Android*, in your mobile device. 
** The version depends on your device. For the ones with a gyroscope the current version works, but for the oneswithout that component, you should install the version 46.0a1.
** The demo session was sucessfully run in a Huawei P8 lite with 46.0a1
** You can download an older apk from https://archive.mozilla.org/pub/mobile/nightly/2015/06/ E.g. for Moto E with Android 50.0s1, you should choose the multi apk in 2015-06-30-03-02-04-mozilla-central-android-api-11/ . Then, install it with: sudo adb install /Téléchargements/fennec-42.0a1.multi.android-arm.apk

### Dealing with permissions in Android (5.1 and 6) ###

Menu->Setting->Developer options (true)

Menu->Setting->Developer options->Debugging->USB debugging (true, and accept permamently the permissions in the popup)

The following step is just for Android 6:
Menu->Applications->Firefox->Permissions->storage (true)

### Dealing with permissions in Firefox for Android ###

Menu->Settings->Advanced->Remote debugging via USB (true)

Then, enter about:config and turn the following entry value to false:
```
#!javascript
xpinstall.signatures.required  
```

### Installing MoWA Authoring ###

Open a terminal in the /chrome/content/data/ folder and download the dependencies with bower:
bower install

Then, move to the root dir of this repo. Edit the params at FennecXpiBuilder file, if required:
sudo gedit ./FennecXpiBuilder.sh

Change the FennecXpiBuilder file permissions:
sudo chmod +x ./FennecXpiBuilder.sh

And finally execute it:
FennecXpiBuilder.sh

## Licensed MIT ##
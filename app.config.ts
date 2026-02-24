import packageJson from "./package.json";

import type { ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";

const BUNDLE_IDENTIFIER = "com.chhaya.notes";

const config: ExpoConfig = {
  name: IS_DEV ? "expo-notes-dev" : "expo-notes",
  slug: "expo-boilerplate",
  scheme: "notesapp",
  version: packageJson.version,
  orientation: "portrait",
  icon: "./assets/logo.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    entitlements: {
      "aps-environment": "production",
    },
    supportsTablet: true,
    googleServicesFile: "./GoogleService-Info.plist",
    bundleIdentifier: BUNDLE_IDENTIFIER,
    infoPlist: {
      NSCameraUsageDescription:
        "This app needs access to the camera to takephotos.",
      NSPhotoLibraryUsageDescription: "This app needs access to your photos.",
      NSAppleMusicUsageDescription: "This app needs access to your photos.",
      UIBackgroundModes: ["remote-notification"],
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            "notesapp",
            "com.googleusercontent.apps.984667336417-2n2vvvr20i33m0dpl9vu03mcf9k76hsv",
          ],
        },
      ],
    },
  },
  android: {
    // adaptiveIcon: {
    //   foregroundImage: "./assets/adaptive-icon.png",
    //   backgroundColor: "#ffffff",
    // },
    package: BUNDLE_IDENTIFIER,
    googleServicesFile: "./google-services.json",
    permissions: [
      "RECEIVE_BOOT_COMPLETED",
      "android.permission.CAMERA",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
    ],
  },
  extra: {
    APP_VARIANT: process.env.APP_VARIANT,
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  experiments: { reactCompiler: true },
  plugins: [
    "expo-sqlite",
    [
      "expo-dev-client",
      {
        launchMode: "most-recent",
      },
    ],

    "expo-asset",
    "expo-font",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          forceStaticLinking: ["RNFBApp"],
        },
      },
    ],
    [
      "react-native-permissions",
      {
        iosPermissions: ["Camera", "PhotoLibrary", "MediaLibrary"],
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    "@react-native-firebase/auth",
    "@react-native-firebase/crashlytics",
    "@react-native-google-signin/google-signin",
  ],
};

export default config;

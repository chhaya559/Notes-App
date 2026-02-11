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
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/notes.png",
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
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: BUNDLE_IDENTIFIER,
    googleServicesFile: "./google-services.json",
    permissions: ["RECEIVE_BOOT_COMPLETED"],
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
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    "@react-native-firebase/auth",
    "@react-native-firebase/crashlytics",
    "@react-native-google-signin/google-signin",
  ],
};

export default config;

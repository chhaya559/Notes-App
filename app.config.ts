import packageJson from "./package.json";

import type { ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";

const BUNDLE_IDENTIFIER = IS_DEV
  ? "com.anonymous.notes.dev"
  : "com.anonymous.notes";

const config: ExpoConfig = {
  name: IS_DEV ? "expo-notes-dev" : "expo-notes",
  slug: "expo-boilerplate",
  version: packageJson.version,
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_IDENTIFIER,
    infoPlist: {
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
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
  },
  extra: {
    APP_VARIANT: process.env.APP_VARIANT,
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  experiments: { reactCompiler: true },
  plugins: [
    [
      "expo-dev-client",
      {
        launchMode: "most-recent",
      },
    ],

    "expo-build-properties",
    "expo-asset",
    "expo-font",
  ],
};

export default config;

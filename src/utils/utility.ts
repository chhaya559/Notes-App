import { Platform } from "react-native";

import { FONT_WEIGHTS } from "./constants";

import { RFValue } from "react-native-responsive-fontsize";
import Toast from "react-native-toast-message";

/**
 * Checks if the current platform is iOS.
 *
 * @returns {boolean} - True if the platform is iOS, false otherwise.
 */
export const isIos = (): boolean => {
  return Platform.OS === "ios";
};

/**
 * Checks if the current platform is Android.
 *
 * @returns {boolean} - True if the platform is Android, false otherwise.
 */
export const isAndroid = (): boolean => {
  return Platform.OS === "android";
};

export const boldText = isAndroid() ? FONT_WEIGHTS[700] : FONT_WEIGHTS[600];

export const _scaleText = (fontSize: number) => {
  return RFValue(fontSize);
};

export const formatName = (name) => {
  const cleaned = name.replaceAll(/\d/g, " ");
  const firstWord = cleaned.trim().split(" ")[0];

  return firstWord;
};

export const sanitizeSearch = (input: string) => {
  if (!input) return "";

  let cleaned = input.trim().replaceAll(/\s+/g, " ");
  cleaned = cleaned.replaceAll(/[^\w\s,-]/g, "");

  return cleaned;
};

export function showError(error) {
  if (error?.data?.errors?.length) {
    Toast.show({
      type: "error",
      text1: error.data.errors[0],
    });
    return;
  }

  if (error?.data?.message) {
    Toast.show({
      type: "error",
      text1: error.data.message,
    });
  }
}

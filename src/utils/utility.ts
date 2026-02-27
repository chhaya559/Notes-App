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

export const formatName = (name: string) => {
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

export function showError(error: {
  data: { errors: string | any[]; message: any };
}) {
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

export function getFirstLinePreview(content: string): string {
  if (!content) return "";
  const standardizedContent = content
    .replace(/<\/li>|<\/p>|<\/div>|<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "");

  const cleanText = standardizedContent.replace(/<(.|\n)*?>/g, "");

  const lines = cleanText.trimStart().split(/\r?\n/);

  const firstLine = lines.find((line) => line.trim().length > 0) || "";

  const finalResult = firstLine.trim();

  return finalResult.length > 30
    ? finalResult.substring(0, 30) + "..."
    : finalResult;
}

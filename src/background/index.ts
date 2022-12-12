import { RgbaColor } from "react-colorful";

export const DEFAULT_COLOR: RgbaColor = { r: 0, g: 0, b: 0, a: 1 };

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.storage.local.set({ color: DEFAULT_COLOR });
  } catch (err) {
    console.warn(err);
  }
});

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    Appodeal?: any;
  }
}

export const initializeAppodeal = () => {
  const appKey = import.meta.env.VITE_APPODEAL_APP_KEY || "7eb3220c211fc42a082836afdad274f4b14768985ddd04df";
  
  if (!appKey || appKey === "YOUR_APPODEAL_APP_KEY") {
    console.warn("Appodeal App Key is not configured. Ads will not be initialized.");
    return;
  }

  if (window.Appodeal) {
    try {
      // Initialize Appodeal for Web
      // Ad types: 1 for Interstitial, 2 for Banner, 4 for Video, 8 for Rewarded Video
      // For web, it's often just Appodeal.initialize(appKey, adTypes)
      window.Appodeal.initialize(appKey, 1 | 2 | 4 | 8);
      console.log("Appodeal initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize Appodeal:", error);
    }
  } else {
    // If the script hasn't loaded yet, retry after a short delay
    setTimeout(initializeAppodeal, 1000);
  }
};

export const showInterstitial = () => {
  if (window.Appodeal && window.Appodeal.isLoaded(1)) {
    window.Appodeal.show(1);
  } else {
    console.log("Interstitial ad is not loaded yet.");
  }
};

export const showRewardedVideo = () => {
  if (window.Appodeal && window.Appodeal.isLoaded(8)) {
    window.Appodeal.show(8);
  } else {
    console.log("Rewarded video ad is not loaded yet.");
  }
};

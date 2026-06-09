const FB_SDK_ID = 'facebook-jssdk';
const FB_SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';

let loadPromise = null;

/**
 * Loads the Facebook JS SDK script once and resolves when window.FB is ready.
 * Subsequent calls return the same promise (idempotent).
 */
export function loadFacebookSDK() {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    if (window.FB) {
      resolve(window.FB);
      return;
    }

    const existingScript = document.getElementById(FB_SDK_ID);

    const onReady = () => resolve(window.FB);

    // fbAsyncInit fires after the SDK script initialises window.FB
    const previousInit = window.fbAsyncInit;
    window.fbAsyncInit = function () {
      if (previousInit) previousInit();
      onReady();
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = FB_SDK_ID;
      script.src = FB_SDK_URL;
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onerror = () => {
        loadPromise = null;
        reject(new Error('Failed to load Facebook SDK. Check network connectivity.'));
      };
      document.head.appendChild(script);
    }
    // If the script already exists but window.FB isn't set yet, fbAsyncInit will fire.
  });

  return loadPromise;
}

export function resetLoader() {
  loadPromise = null;
}

// Register the service worker for PWA / offline support.
// When a new deploy installs, the app gets a "sw-update-ready" event and shows
// a refresh prompt instead of reloading mid-workout.

const UPDATE_EVENT = "sw-update-ready";

function notifyUpdate() {
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function register() {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    // Captured before registering: on a first install clients.claim() sets a
    // controller too, which must not be mistaken for an update.
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker
      .register(swUrl, { updateViaCache: "none" })
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "activated" && hadController) notifyUpdate();
          };
        };

        // Installed home-screen apps can stay open for days; check for a new
        // deploy whenever the app comes back to the foreground.
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") registration.update().catch(() => {});
        });
      })
      .catch((error) => {
        console.error("SW registration failed:", error);
      });
  });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) => console.error(error.message));
  }
}

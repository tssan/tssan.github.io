async function registerSW() {
    if("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("/sw.js");
        } catch (e) {
            console.log("ServiceWorker registration failed", e);
        }
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    // register service worker
    registerSW();
});

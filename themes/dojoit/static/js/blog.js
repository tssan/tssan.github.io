async function registerSW() {
    if("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("/sw.js");
        } catch (e) {
            console.log("ServiceWorker registration failed", e);
        }
    }
}

const handleSpinner = () => {
    const spinner = document.getElementById('spinner');

    spinner.addEventListener('click', e => {
        spinner.style.display = 'none';
    });
}

const showSpinner = () => {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
}
const hideSpinner = () => {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'none';
}

document.addEventListener("DOMContentLoaded", (event) => {
    // spinner
    handleSpinner();

    // register service worker
    registerSW();
});

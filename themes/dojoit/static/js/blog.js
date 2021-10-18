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
    // const $nav = document.getElementById('main-nav');
    // const $menuOpenBtn = document.getElementsByClassName('btn-menu-open')[0];
    // const $menuCloseBtn = document.getElementsByClassName('btn-menu-close')[0];

    // $menuOpenBtn.addEventListener('click', e => {
    //     console.log('A');
    //     $nav.classList.remove('desktop-hidden');
    //     $menuCloseBtn.classList.remove('desktop-hidden');
    //     $menuOpenBtn.classList.add('desktop-hidden');
    // });

    // $menuCloseBtn.addEventListener('click', e => {
    //     console.log('B');
    //     $menuOpenBtn.classList.remove('desktop-hidden');
    //     $menuCloseBtn.classList.add('desktop-hidden');
    //     $nav.classList.add('desktop-hidden');
    // });

    // register service worker
    registerSW();
});

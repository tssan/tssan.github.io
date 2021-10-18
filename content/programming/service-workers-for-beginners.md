Title: Service Workers for beginners
Summary: What is Service Worker and what can you do with it?
Date: 2018-10-20
Tags: javascirpt, ServiceWorker, PWA
Status: published



# What is Service Worker?

Service Worker is a JavaScript that runs on separate thread. It doesn't have access to DOM as the website's main script. Why is it so important and for what reason you can use SW?

When website runs JS scripts, it uses single thread. Every event like mouse click or move, scrolling and listening other events are handled by the main thread. That means when the code is broken end eg. stuck in infinite loop then everything will freeze. It is also possible for SW to control network requests which makes it really powerfull tool. Also if you wish to do any time consuming computations you can pass that heavy work to SW. Those things are affecting user's expirience very much and as you probably know the responsiveness is very important nowadays.

## Progressive Web App

PWA is a website that can work offline - this is the simplest definition I can think of. I'm mentioning about it because PWA doesn't exist without Service Worker. Actually it is the SW that do all the work. By managing network's requests you can specify which response should be cached. This way you can render cached data being offline. There is more cool features like adding shortcut to mobile homescreen, setting theme colours, no browser url bar, custom icons. On mobile devices PWA looks just like native application.

Those are the basic informations about Service Worker and the Progressive Web App. I'm not going into more details. I hope it will help you understand a bit more this subject. Let's make a working example now.


# Quotes PWA - example

You can find a full example [here](https://github.com/tssan/quotes-pwa){:target="_blank"}.

Ok lets set some rules, how this example should work:

* show random quote from fetched quotes
* on load fetch quotes
* on button click change random quote (show next)

Changing quotes should work offline. Fetched quotes should be cached.

When writing the code below I was inspired by this [video](https://www.youtube.com/watch?v=b4rpUeVPe8I){:target="_blank"}.

## Samples - quotes.json

Project structure will look more or less like so:

```shell
$ tree quotes-pwa
.
├── node_modules
├── src
    ├── app.css
    ├── app.js
    ├── icon.png
    ├── index.html
    ├── manifest.webmanifest
    └── sw.js
├── .gitignore
├── Makefile
├── package.json
└── quotes.json
```

As we assumed, quotes will be fetched from external source. I'm using json-server for this task. It will serve a json file on default port 3000. You can use any server you like but remember to pass the correct url into fetch function later on. First prepare sample json like this:

```shell
// quotes.json

{
    "quotes": [
        {"id": 0, "quote": "Ut in id fugiat dolor ut aute consectetur eu eu laboris ex enim  consequat eu ad dolore."},
        {"id": 1, "quote": "Mollit deserunt ullamco ex in ut nisi do culpa ea culpa fugiat irure sint consectetur."},
        {"id": 2, "quote": "Id sint pariatur laboris officia est laboris eu velit id nulla nulla incididunt amet occaecat."},
        ...
    ]
}
```

Next install json-server:

`$ npm install --save-dev json-server`

Lets create Makefile:

```shell
NODE_BIN?=./node_modules/.bin
SRC_PATH?=./src


.PHONY: install
install:
    @npm i

.PHONY: clean
clean:
    @rm -rf node_modules

.PHONY: run
run:
    @cd $(SRC_PATH) && python -m SimpleHTTPServer 8010

.PHONY: quotes-api
quotes-api:
    @$(NODE_BIN)/json-server --watch quotes.json
```

Now if you run `make quotes-api` and go to `http://localhost:3000` you should see quotes.json content.

## App page - HTML & js

HTML is very short and simple. For styling you can use any css framework or create your own styles. I'm using bootstrap.

```html
// index.html

<body>
    <main class="container shadow-sm p-3 mb-5 rounded">
        <blockquote id="quote-box" class="blockquote shadow-sm p-3 mb-5 bg-white rounded">loading...</blockquote>
        <button id="quote-btn" class="btn btn-primary">Show next quote</button>
    </main>

    <script type="text/javascript" src="app.js"></script>
    <script type="text/javascript" src="sw.js"></script>
</body>
```

Lets handle fetching quotes and handle button click.

```javascript
// app.js

async function app() {
    const quotes = await fetch('http://localhost:3000/quotes').then(resp => resp.json())
    const quoteBtn = document.getElementById('quote-btn')
    const quoteBox = document.getElementById('quote-box')
    let idx = 0

    quoteBtn.addEventListener('click', e => {
        idx++;
        quoteBox.innerHTML = quotes[idx % quotes.length].quote
    })

    if(quotes.length > 0) {
        quoteBox.innerHTML = quotes[idx % quotes.length].quote
    }
}

window.addEventListener('load', () => {
    app()
})
```

To be sure document is loaded I'm listening window `load` event. Everything is inside the app function where I'm increasing index on button click and updating `#quote-box` content.

## PWA

First step in creating PWA page is adding mainfest file into the head block.

`<link rel="manifest" href="/manifest.webmanifest"/>`

Manifest is just a JSON file. There are few required attributes to make it work, here is an example of how a manifest can look like:

```json
// manifest.webmanifest

{
    "name": "Quotes PWA",
    "short_name": "quotes",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#206846",
    "theme_color": "#206846",
    "description": "Service Worker example.",
    "icons": [
        {
            "src": "icon.png",
            "sizes": "144x144",
            "type": "image/png"
        }
    ]
}
```

In Chrome Development Tools `Application` tab should show manifest parameters like so:

[![Application tab](/images/sw_1.png)](/images/sw_1.png){:target="_blank"}

## Service Worker

Last missing piece is a Service Worker. Create sw.js file. Then it must be registered. In this example lets do this in app.js:

```javascript
// app.js

...

async function registerSW() {
    if('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js')
        } catch (e) {
            console.log('SW registration failed')
        }
    }
}

window.addEventListener('load', () => {
    app()
    registerSW()
})
```

Last thing to do is implement SW itself. This is very powerful tool. In SW script you decide how and when cache fatched data, which static files should be cached and which caching strategy should be used.

Put all the code in sw.js. Choose a name for app cache and define all statics that should be cached on install event.

```javascript
const cacheName = 'quotespwa'
const staticAssets = [
    '/icon.png',
    '/app.js',
    '/app.css',
    '/index.html'
]
```

SW has it's own lifecycle. At the start install event is triggered. Then if successful activate event. You can write a simple code to handle those two, like so:

```javascript
self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName)
    await cache.addAll(staticAssets)
    return self.skipWaiting()
})

self.addEventListener('activate', e => {
    self.clients.claim()
})
```

Ok, that looks good already. Now it would be great to intercept fetch requests and cache them. Generally there are two cases:

1. same origin requests
2. cross origin requests

In first case scenario we know that response should be in cache because it is from same host. It might need special handling when it is call for some dynamic data like API call but in this example we will ignore that.

```javascript
async function cacheFirst(req) {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(req)
    return cached || fetch(req)
}
```

In second case, we want to get a 'fresh' response and cache them. If that fails, then you can get the response from the cache. In the app.js we don't use any fetches so functions below are not required. In case you want to try to fetch data from external sources then that's how the cache functions should look like.

```javascript
async function networkAndCache(req) {
    const cache = await caches.open(cacheName)
    try {
        const freshResponse = await fetch(req)
        await cache.put(req, freshResponse.clone())
        return freshResponse
    } catch (e) {
        const cached = await cache.match(req)
        return cached
    }
}
```

To pass cached response to the fetch, worker uses 'event.respondWith' function like so:

```javascript
self.addEventListener('fetch', async e => {
    const req = e.request
    const url = new URL(req.url)
    if(url.origin === location.origin) {
        e.respondWith(cacheFirst(req))
    } else {
        e.respondWith(networkAndCache(req))
    }
})
```

At this point PWA page is completed. You can check in Dev Tools what is cached and try simulate offline state. Quotes should be retrieved from cache in offline mode.

# Summary

This example shows how to setup necessary parts of website to meet PWA requirements. Just to sum up, they are:

* create and link manifest.webmanifest file
* register Service Worker
* implement functions handling SW's lifecycle events

In more complicated app the caching functions would be much more complex. There are already libraries that can handle it for you but it is very good problem to try solve and learn from it. So I encourage you to at least try experiment with this example using low level SW API.

Code is available [here](https://github.com/tssan/quotes-pwa){:target="_blank"}

Thanks for reading and please leave any comment below. Cheers!

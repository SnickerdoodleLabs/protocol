setInterval(async () => {
  (await navigator.serviceWorker.ready).active.postMessage("");
}, 20e3);

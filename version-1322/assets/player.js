(function () {
    var video = document.getElementById("movie-player");
    var overlay = document.getElementById("player-overlay");
    var data = document.getElementById("movie-play-data");
    if (!video || !overlay || !data) {
        return;
    }

    var media = JSON.parse(data.textContent || "{}");
    var mediaUrl = media.url || "";
    var loaded = false;
    var hls = null;

    function attachStream() {
        if (loaded || !mediaUrl) {
            return Promise.resolve();
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = mediaUrl;
            return Promise.resolve();
        }
        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(mediaUrl);
            hls.attachMedia(video);
            return new Promise(function (resolve) {
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
            });
        }
        video.src = mediaUrl;
        return Promise.resolve();
    }

    function playVideo() {
        overlay.hidden = true;
        attachStream().then(function () {
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    overlay.hidden = false;
                });
            }
        });
    }

    overlay.addEventListener("click", playVideo);
    video.addEventListener("click", function () {
        if (video.paused) {
            playVideo();
        } else {
            video.pause();
        }
    });
    video.addEventListener("play", function () {
        overlay.hidden = true;
    });
    video.addEventListener("ended", function () {
        overlay.hidden = false;
    });
    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
        }
    });
})();

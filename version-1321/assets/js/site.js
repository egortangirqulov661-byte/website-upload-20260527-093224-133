(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-site-search]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input");
        var q = input ? input.value.trim() : "";
        var url = form.getAttribute("action") || "./search.html";
        if (q) {
          window.location.href = url + "?q=" + encodeURIComponent(q);
        } else {
          window.location.href = url;
        }
      });
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });

    var hero = document.querySelector(".hero");
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
    }

    show(0);
    start();
  }

  function setupFilters() {
    var input = document.querySelector("[data-filter-input]");
    var select = document.querySelector("[data-filter-select]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var empty = document.querySelector("[data-empty-state]");
    if (!cards.length || (!input && !select)) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    if (input && q) {
      input.value = q;
    }

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var year = select ? select.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        var cardYear = card.getAttribute("data-year") || "";
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchYear = !year || cardYear === year;
        var show = matchKeyword && matchYear;
        card.style.display = show ? "flex" : "none";
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    if (select) {
      select.addEventListener("change", apply);
    }
    apply();
  }

  ready(function () {
    setupNavigation();
    setupHero();
    setupFilters();
  });
})();

function initMoviePlayer(source) {
  var video = document.getElementById("movieVideo");
  var button = document.getElementById("playButton");
  if (!video || !button || !source) {
    return;
  }

  var started = false;

  function bindSource() {
    if (started) {
      return;
    }
    started = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function play() {
    bindSource();
    button.classList.add("is-hidden");
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {
        button.classList.remove("is-hidden");
      });
    }
  }

  button.addEventListener("click", play);
  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    } else {
      video.pause();
    }
  });
}

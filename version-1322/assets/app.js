(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    ready(function () {
        var menuButton = document.querySelector(".mobile-menu-button");
        var nav = document.querySelector(".main-nav");
        if (menuButton && nav) {
            menuButton.addEventListener("click", function () {
                var open = nav.classList.toggle("is-open");
                menuButton.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        document.querySelectorAll(".site-search").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                var target = "./search.html";
                if (query) {
                    target += "?q=" + encodeURIComponent(query);
                }
                window.location.href = target;
            });
        });

        document.querySelectorAll("[data-hero]").forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === index);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === index);
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
                    timer = null;
                }
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    show(dotIndex);
                    start();
                });
            });

            if (prev) {
                prev.addEventListener("click", function () {
                    show(index - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(index + 1);
                    start();
                });
            }

            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
            show(0);
            start();
        });

        document.querySelectorAll("[data-filter-input]").forEach(function (input) {
            var section = input.closest(".content-section") || document;
            var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card"));
            input.addEventListener("input", function () {
                var query = normalize(input.value);
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-search") || card.textContent);
                    card.classList.toggle("is-hidden", query && haystack.indexOf(query) === -1);
                });
            });
        });

        document.querySelectorAll("[data-sorter]").forEach(function (select) {
            var section = select.closest(".content-section") || document;
            var list = section.querySelector("[data-card-list]");
            if (!list) {
                return;
            }
            var original = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
            select.addEventListener("change", function () {
                var value = select.value;
                var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
                if (value === "default") {
                    cards = original.slice();
                } else if (value === "title") {
                    cards.sort(function (a, b) {
                        return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
                    });
                } else {
                    cards.sort(function (a, b) {
                        return Number(b.getAttribute("data-" + value) || 0) - Number(a.getAttribute("data-" + value) || 0);
                    });
                }
                cards.forEach(function (card) {
                    list.appendChild(card);
                });
            });
        });
    });
})();

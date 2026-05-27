(function () {
    function createCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return "<article class=\"movie-card card-hover\">" +
            "<a href=\"" + movie.href + "\" class=\"movie-link\" aria-label=\"观看" + escapeHtml(movie.title) + "\">" +
            "<span class=\"poster-frame\"><img src=\"" + movie.cover + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\"><span class=\"poster-badge\">" + escapeHtml(movie.rating) + "</span></span>" +
            "<span class=\"movie-card-body\"><span class=\"movie-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></span>" +
            "<strong class=\"movie-title\">" + escapeHtml(movie.title) + "</strong>" +
            "<span class=\"movie-genre\">" + escapeHtml(movie.genre) + "</span>" +
            "<span class=\"movie-desc\">" + escapeHtml(movie.desc) + "</span>" +
            "<span class=\"tag-row\">" + tags + "</span></span></a></article>";
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>\"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return (params.get("q") || "").trim();
    }

    var input = document.getElementById("search-query");
    var title = document.getElementById("search-title");
    var results = document.getElementById("search-results");
    var query = getQuery();
    if (input) {
        input.value = query;
    }
    if (!results || !window.SEARCH_MOVIES) {
        return;
    }
    if (!query) {
        return;
    }
    var lower = query.toLowerCase();
    var matched = window.SEARCH_MOVIES.filter(function (movie) {
        return String(movie.search || "").toLowerCase().indexOf(lower) !== -1;
    });
    if (title) {
        title.textContent = "与“" + query + "”相关的内容";
    }
    if (matched.length) {
        results.innerHTML = matched.map(createCard).join("");
    } else {
        results.innerHTML = "<div class=\"empty-state glass-effect\"><h2>未找到相关内容</h2><p>可以尝试更换剧名、地区、类型或标签继续搜索。</p><a class=\"btn-peach\" href=\"./categories.html\">浏览分类</a></div>";
    }
})();

(function () {
    var toolNav = document.getElementById('toolNav');
    if (!toolNav) return;
    var NOINDEX = {
        'image-blur': 1,
        'image-sharpen': 1,
        'image-grayscale': 1,
        'image-brightness': 1,
        'image-contrast': 1,
        'image-saturation': 1,
        'image-invert': 1,
        'image-sepia': 1
    };
    fetch('/data/tools.json')
        .then(function (res) {
            return res.json();
        })
        .then(function (tools) {
            tools.forEach(function (tool) {
                if (!tool || !tool.slug || NOINDEX[tool.slug]) return;
                var a = document.createElement('a');
                a.href = '/tools/' + tool.slug + '/';
                a.textContent = tool.title || tool.name || tool.slug;
                a.style.marginRight = '15px';
                toolNav.appendChild(a);
            });
        })
        .catch(function () {});
})();

(function () {
    function initNavToggle() {
        var nav = document.querySelector('.nav, .navbar');
        if (!nav) return;
        var toggle = nav.querySelector('.nav-toggle');
        var links = nav.querySelector('.nav-links');
        if (!toggle || !links) return;
        if (toggle.getAttribute('data-ft-bound') === '1') return;
        toggle.setAttribute('data-ft-bound', '1');
        if (!toggle.getAttribute('type')) toggle.setAttribute('type', 'button');
        if (!toggle.hasAttribute('aria-expanded')) toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', function () {
            links.classList.toggle('nav-open');
            toggle.setAttribute(
                'aria-expanded',
                links.classList.contains('nav-open') ? 'true' : 'false'
            );
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavToggle);
    } else {
        initNavToggle();
    }
})();

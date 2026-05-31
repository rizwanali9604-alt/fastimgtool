/**
 * Homepage horizontal tool cards + category filtering.
 */
(function () {
    'use strict';

    var CAT_MAP = {
        compression: 'optimize',
        resize: 'optimize',
        conversion: 'convert',
        effects: 'effects',
        editing: 'transform',
        test: 'all'
    };

    var ICONS = [
        ['compressor', '🗜️'],
        ['resizer', '↔️'],
        ['resize', '↔️'],
        ['crop', '✂️'],
        ['rotate', '🔄'],
        ['flip', '🔃'],
        ['blur', '🌫️'],
        ['sharpen', '💎'],
        ['brightness', '☀️'],
        ['contrast', '◑'],
        ['saturation', '🎨'],
        ['sepia', '🟤'],
        ['grayscale', '⬜'],
        ['invert', '🔲'],
        ['webp', '🔄'],
        ['heic', '📱'],
        ['base64', '📝'],
        ['gif', '🖼️'],
        ['bmp', '🖼️'],
        ['tiff', '📄'],
        ['jpg', '🔄'],
        ['png', '🔄']
    ];

    function iconFor(tool) {
        var hay = ((tool.slug || '') + ' ' + (tool.title || '')).toLowerCase();
        for (var i = 0; i < ICONS.length; i++) {
            if (hay.indexOf(ICONS[i][0]) !== -1) return ICONS[i][1];
        }
        return '🖼️';
    }

    function catFor(tool) {
        return CAT_MAP[tool.category] || 'all';
    }

    function renderTools(toolsList) {
        var grid = document.getElementById('toolsGrid');
        if (!grid) return;

        grid.innerHTML = toolsList
            .filter(function (t) {
                return t.slug !== 'test-tool';
            })
            .map(function (tool) {
                var cat = catFor(tool);
                var icon = iconFor(tool);
                var popular = ['image-compressor', 'image-resizer', 'jpg-to-png', 'png-to-jpg'].indexOf(tool.slug) !== -1;
                return (
                    '<a href="/tools/' +
                    tool.slug +
                    '/" class="tool-card-h" data-cat="' +
                    cat +
                    '">' +
                    '<div class="tool-icon-wrap">' +
                    icon +
                    '</div>' +
                    '<div class="tool-info">' +
                    '<div class="tool-name">' +
                    tool.title +
                    (popular ? ' <span style="font-size:10px;background:#DBEAFE;color:#1E40AF;padding:2px 6px;border-radius:99px;margin-left:4px;">Popular</span>' : '') +
                    '</div>' +
                    '<div class="tool-desc">' +
                    (tool.description || 'Free online image tool') +
                    '</div>' +
                    '</div>' +
                    '<div class="tool-arrow">→</div>' +
                    '</a>'
                );
            })
            .join('');

        document.querySelectorAll('.cat-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.cat-tab').forEach(function (t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');
                var cat = tab.getAttribute('data-cat');
                document.querySelectorAll('.tool-card-h').forEach(function (card) {
                    card.style.display = cat === 'all' || card.getAttribute('data-cat') === cat ? 'flex' : 'none';
                });
            });
        });
    }

    function loadGuidesPreview() {
        var el = document.getElementById('guidesGridHome');
        if (!el) return;
        fetch('/data/guides.json')
            .then(function (r) {
                return r.json();
            })
            .then(function (guides) {
                var picks = guides.slice(0, 6);
                el.innerHTML = picks
                    .map(function (g) {
                        return (
                            '<a href="' +
                            g.url +
                            '" class="guide-card">' +
                            '<span class="guide-card-tag">Guide</span>' +
                            '<span class="guide-card-title">' +
                            g.title +
                            '</span>' +
                            '<span class="guide-card-arrow">Read guide →</span>' +
                            '</a>'
                        );
                    })
                    .join('');
            })
            .catch(function () {});
    }

    window.FastImgHome = { renderTools: renderTools, loadGuidesPreview: loadGuidesPreview };

    document.addEventListener('DOMContentLoaded', function () {
        fetch('/data/tools.json')
            .then(function (r) {
                return r.json();
            })
            .then(function (tools) {
                renderTools(tools);
                var statTools = document.getElementById('statToolCount');
                if (statTools) statTools.textContent = String(tools.filter(function (t) { return t.slug !== 'test-tool'; }).length);
            })
            .catch(function (err) {
                console.error(err);
            });
        loadGuidesPreview();
    });
})();

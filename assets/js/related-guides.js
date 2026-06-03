// Related Guides Engine
(function () {
    'use strict';

    var Esc = window.FastImgEscape || {};

    function escapeHtml(v) {
        return Esc.escapeHtml ? Esc.escapeHtml(v) : String(v == null ? '' : v);
    }

    function escapeAttr(v) {
        return Esc.escapeAttr ? Esc.escapeAttr(v) : String(v == null ? '' : v);
    }

    function safeGuideUrl(url) {
        return Esc.safeGuideUrl ? Esc.safeGuideUrl(url) : url || '#';
    }

    function normalizePath(pathname) {
        var p = pathname || '';
        if (!p.startsWith('/')) p = '/' + p;
        return p.replace(/\/+$/, '') || '/';
    }

    /**
     * Tool pages: /tools/{slug}/ → slug
     * Guide pages: match guides.json url or body[data-tool-slug]
     */
    function resolveToolSlug(guides, pathname) {
        var segments = pathname.split('/').filter(Boolean);
        var section = segments[0] || '';

        if (section === 'tools' && segments.length >= 2) {
            var toolSeg = segments[1].replace(/\.html$/i, '');
            return Esc.safeSlug ? Esc.safeSlug(toolSeg) : toolSeg;
        }

        if (section === 'guides') {
            var current = normalizePath(pathname);
            var file = segments[segments.length - 1] || '';
            var entry = guides.find(function (g) {
                if (!g || !g.url) return false;
                var gu = normalizePath(g.url);
                return gu === current || gu.endsWith('/' + file);
            });
            if (entry && entry.tool_slug) {
                return Esc.safeSlug ? Esc.safeSlug(entry.tool_slug) : entry.tool_slug;
            }
            var fromBody = document.body && document.body.getAttribute('data-tool-slug');
            if (fromBody) {
                return Esc.safeSlug ? Esc.safeSlug(fromBody) : fromBody;
            }
        }

        return '';
    }

    function buildGuideCard(guide) {
        return (
            '<a href="' +
            escapeAttr(safeGuideUrl(guide.url)) +
            '" class="guide-card">' +
            '<span class="guide-card-tag">Guide</span>' +
            '<span class="guide-card-title">' +
            escapeHtml(guide.title) +
            '</span>' +
            '<span class="guide-card-arrow">Read guide →</span>' +
            '</a>'
        );
    }

    async function loadRelatedGuides() {
        var container = document.getElementById('related-guides-container');
        if (!container) return;

        try {
            var pathname = window.location.pathname;
            var currentPath = normalizePath(pathname);

            var response = await fetch('/data/guides.json');
            var guides = await response.json();

            var toolSlug = resolveToolSlug(guides, pathname);
            if (!toolSlug) {
                container.style.display = 'none';
                return;
            }

            var toolGuides = guides.filter(function (g) {
                if (!g || !g.tool_slug || !g.url) return false;
                var sameTool = g.tool_slug === toolSlug;
                var notCurrent = normalizePath(g.url) !== currentPath;
                return sameTool && notCurrent;
            });

            if (toolGuides.length === 0) {
                container.style.display = 'none';
                return;
            }

            var isGrid = container.classList.contains('guides-grid');
            if (isGrid) {
                container.innerHTML = toolGuides
                    .slice(0, 6)
                    .map(buildGuideCard)
                    .join('');
                return;
            }

            var html = '<h3>Related Guides</h3><ul>';
            toolGuides.forEach(function (guide) {
                html +=
                    '<li><a href="' +
                    escapeAttr(safeGuideUrl(guide.url)) +
                    '">' +
                    escapeHtml(guide.title) +
                    '</a></li>';
            });
            html += '</ul>';
            container.innerHTML = html;
        } catch (err) {
            console.error('Related guides error:', err);
            container.style.display = 'none';
        }
    }

    document.addEventListener('DOMContentLoaded', loadRelatedGuides);
})();

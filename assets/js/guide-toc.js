/**
 * Build TOC from H2 headings in guide content (runs on guide pages).
 */
(function () {
    'use strict';

    function slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var content = document.querySelector('.guide-content');
        var toc = document.getElementById('tocList');
        if (!content || !toc) return;

        var headings = content.querySelectorAll('h2');
        if (!headings.length) {
            toc.innerHTML = '<li><span style="color:#64748b">No sections</span></li>';
            return;
        }

        var html = '';
        headings.forEach(function (h, i) {
            if (!h.id) h.id = slugify(h.textContent) || 'section-' + (i + 1);
            html += '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>';
        });
        toc.innerHTML = html;
    });
})();

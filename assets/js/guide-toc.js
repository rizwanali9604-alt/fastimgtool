/**
 * Build TOC from H2 headings in guide content (runs on guide pages).
 */
(function () {
    'use strict';

    function slugify(text) {
        return String(text || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var content = document.querySelector('.guide-content');
        var toc = document.getElementById('tocList');
        if (!content || !toc) return;

        var headings = content.querySelectorAll('h2');
        toc.innerHTML = '';

        if (!headings.length) {
            var empty = document.createElement('li');
            var span = document.createElement('span');
            span.style.color = '#64748b';
            span.textContent = 'No sections';
            empty.appendChild(span);
            toc.appendChild(empty);
            return;
        }

        headings.forEach(function (h, i) {
            if (!h.id) {
                h.id = slugify(h.textContent) || 'section-' + (i + 1);
            }
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent;
            li.appendChild(a);
            toc.appendChild(li);
        });
    });
})();

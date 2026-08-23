/**
 * Shared UI utilities (CalStacker-style nav, tabs, footer year).
 */
(function () {
    'use strict';

    function initCalcTabs(selector, cardSelector) {
        document.querySelectorAll(selector).forEach(function (tab) {
            tab.addEventListener('click', function () {
                var group = tab.closest('.cat-tabs, .category-tabs');
                if (group) {
                    group.querySelectorAll(selector).forEach(function (t) {
                        t.classList.remove('active');
                    });
                }
                tab.classList.add('active');
                var cat = tab.getAttribute('data-cat');
                document.querySelectorAll(cardSelector).forEach(function (card) {
                    var c = card.getAttribute('data-cat');
                    var show = cat === 'all' || !cat || c === cat;
                    card.style.display = show ? '' : 'none';
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initCalcTabs('.cat-tab', '.calc-card, .tool-card-h, .tool-card');
        var y = document.getElementById('footerYear');
        if (y) y.textContent = String(new Date().getFullYear());
    });
})();

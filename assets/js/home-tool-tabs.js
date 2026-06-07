/** Homepage category tab filtering for hardcoded .tool-card grid */
(function () {
    document.querySelectorAll('.cat-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.cat-tab').forEach(function (t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            var cat = tab.getAttribute('data-cat');
            document.querySelectorAll('.tool-card').forEach(function (card) {
                var show = cat === 'all' || card.getAttribute('data-cat') === cat;
                card.style.display = show ? 'flex' : 'none';
            });
        });
    });
})();

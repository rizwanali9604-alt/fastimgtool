/** Homepage category tab filtering for the catalog grid only */
(function () {
    function catalogCards() {
        return document.querySelectorAll('.tools-grid[data-grid="catalog"] .tool-card');
    }
    function showForTab(cat) {
        catalogCards().forEach(function (card) {
            var show = cat === 'all' || card.getAttribute('data-cat') === cat;
            card.style.display = show ? 'flex' : 'none';
        });
    }
    document.querySelectorAll('.cat-tab[data-cat]').forEach(function (tab) {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.cat-tab[data-cat]').forEach(function (t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            showForTab(tab.getAttribute('data-cat'));
        });
    });
    showForTab('all');
})();

fetch("/data/tools.json")
.then(res => res.json())
.then(tools => {

const nav = document.getElementById("toolNav");

if(!nav) return;

tools.forEach(tool => {

const a = document.createElement("a");

a.href = `/tools/${tool.slug}/`;

a.textContent = tool.title || tool.name || tool.slug;

a.style.marginRight = "15px";

nav.appendChild(a);

});

});

(function () {
    function initNavToggle() {
        var nav = document.querySelector('.nav, .navbar');
        if (!nav) return;
        var toggle = nav.querySelector('.nav-toggle');
        var links = nav.querySelector('.nav-links');
        if (!toggle || !links) return;
        if (toggle.getAttribute('data-ft-bound') === '1') return;
        toggle.setAttribute('data-ft-bound', '1');
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

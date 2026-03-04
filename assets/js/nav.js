fetch("/data/tools.json")
.then(res => res.json())
.then(tools => {

const nav = document.getElementById("toolNav");

if(!nav) return;

tools.forEach(tool => {

const a = document.createElement("a");

a.href = `/tools/${tool.slug}/`;

a.textContent = tool.name;

a.style.marginRight = "15px";

nav.appendChild(a);

});

});
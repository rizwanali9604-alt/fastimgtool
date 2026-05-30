fetch("/data/tools.json")
.then(res => res.json())
.then(tools => {

const container = document.getElementById("related-tools-container");

if(!container) return;

tools.forEach(tool => {

const link = document.createElement("a");

link.href = `/tools/${tool.slug}/`;

link.textContent = tool.title || tool.name || tool.slug;

link.style.marginRight = "10px";

container.appendChild(link);

});

});
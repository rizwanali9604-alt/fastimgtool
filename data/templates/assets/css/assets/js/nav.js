async function loadTools() {

const container = document.getElementById("toolNav");
if(!container) return;

try {

const response = await fetch("/data/tools.json?nocache=" + Date.now());
const tools = await response.json();

let html = `
<h2>Explore Tools</h2>
<div style="margin-top:20px">
`;

tools.forEach(tool => {

html += `
<a href="/${tool.file}" 
style="margin:10px;display:inline-block;color:#60a5fa;">
${tool.title}
</a>
`;

});

html += "</div>";

container.innerHTML = html;

} catch(e) {

container.innerHTML = `
<h2>Explore Tools</h2>
<a href="/">Image Compressor</a>
<a href="/image-resizer.html">Image Resizer</a>
`;

}

}

document.addEventListener("DOMContentLoaded", loadTools);

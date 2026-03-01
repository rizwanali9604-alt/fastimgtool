async function loadTools() {

const container = document.getElementById("toolNav");
if(!container) return;

try {

const response = await fetch("/data/tools.json", { cache: "no-store" });

if(!response.ok) throw new Error("Failed");

const tools = await response.json();

let html = `
<h2>Explore Tools</h2>
<div style="margin-top:20px;">
`;

tools.forEach(tool => {

html += `
<a href="/${tool.file}" 
style="margin:10px;display:inline-block;color:#60a5fa;">
${tool.title}
</a>
`;

});

html += `</div>`;

container.innerHTML = html;

} catch(e) {

console.warn("Tools failed to load");

container.innerHTML = `
<h2>Explore Tools</h2>

<a href="/">Image Compressor</a>
<a href="/image-resizer.html">Image Resizer</a>
<a href="/convert-jpg-to-png-online-free.html">JPG to PNG</a>
<a href="/png-to-jpg-converter.html">PNG to JPG</a>
<a href="/webp-to-jpg-converter.html">WEBP to JPG</a>
`;

}

}

document.addEventListener("DOMContentLoaded", loadTools);

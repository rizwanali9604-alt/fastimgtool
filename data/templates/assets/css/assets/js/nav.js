async function loadTools() {

const container = document.getElementById("toolNav");
if(!container) return;

try {

const response = await fetch("./data/tools.json?nocache=" + Date.now());

if(!response.ok) throw new Error("Fetch failed");

const tools = await response.json();

let html = `
<h2>Explore Tools</h2>
<div style="margin-top:20px;">
`;

tools.forEach(tool => {

html += `
<a href="${tool.file}" 
style="margin:10px;display:inline-block;color:#60a5fa;">
${tool.title}
</a>
`;

});

html += "</div>";

container.innerHTML = html;

} catch (err) {

console.warn("Navigation failed", err);

container.innerHTML = `
<h2>Explore Tools</h2>

<a href="/" style="margin:10px;display:inline-block;color:#60a5fa;">
Fast Image Compressor
</a>

<a href="/image-resizer.html" style="margin:10px;display:inline-block;color:#60a5fa;">
Image Resizer
</a>

<a href="/convert-jpg-to-png-online-free.html" style="margin:10px;display:inline-block;color:#60a5fa;">
Convert JPG to PNG
</a>

<a href="/png-to-jpg-converter.html" style="margin:10px;display:inline-block;color:#60a5fa;">
PNG to JPG Converter
</a>

<a href="/webp-to-jpg-converter.html" style="margin:10px;display:inline-block;color:#60a5fa;">
WEBP to JPG Converter
</a>
`;

}

}

document.addEventListener("DOMContentLoaded", loadTools);

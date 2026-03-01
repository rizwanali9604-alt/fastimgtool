async function loadTools() {

const container = document.getElementById("toolNav");
if(!container) return;

try {

const response = await fetch("/data/tools.json");

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

container.innerHTML = `
<h2>Explore Tools</h2>

<a href="/">Fast Image Compressor</a>
<a href="/image-resizer.html">Image Resizer</a>
<a href="/convert-jpg-to-png-online-free.html">Convert JPG to PNG</a>
<a href="/png-to-jpg-converter.html">PNG to JPG Converter</a>
<a href="/webp-to-jpg-converter.html">WEBP to JPG Converter</a>
`;

}

}

document.addEventListener("DOMContentLoaded", loadTools);

// Related Guides Engine
async function loadRelatedGuides() {
    const container = document.getElementById('related-guides-container');
    if (!container) return;

    try {
        // Get current tool slug from URL
        const path = window.location.pathname;
        const slug = path.split('/').filter(Boolean).pop();

        // Fetch guides data
        const response = await fetch('/data/guides.json');
        const guides = await response.json();

        // Filter guides for this tool
        const toolGuides = guides.filter(g => g.tool_slug === slug);

        if (toolGuides.length === 0) {
            container.style.display = 'none';
            return;
        }

        // Build HTML
        let html = '<h3>Related Guides</h3><ul>';
        toolGuides.forEach(guide => {
            html += `<li><a href="${guide.url}">${guide.title}</a></li>`;
        });
        html += '</ul>';
        container.innerHTML = html;
    } catch (err) {
        console.error('Related guides error:', err);
        container.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', loadRelatedGuides);
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

        // Build HTML — horizontal guide cards when inside .guides-grid
        const isGrid = container.classList.contains('guides-grid');
        if (isGrid) {
            let html = '';
            toolGuides.slice(0, 6).forEach(function (guide) {
                html +=
                    '<a href="' +
                    guide.url +
                    '" class="guide-card">' +
                    '<span class="guide-card-tag">Guide</span>' +
                    '<span class="guide-card-title">' +
                    guide.title +
                    '</span>' +
                    '<span class="guide-card-arrow">Read guide →</span>' +
                    '</a>';
            });
            container.innerHTML = html;
            return;
        }

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
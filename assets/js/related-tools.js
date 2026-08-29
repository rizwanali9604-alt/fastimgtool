// Related Tools Engine
async function loadRelatedTools() {
    const container = document.getElementById('related-tools-container');
    if (!container) return;

    try {
        // Get current tool slug from URL
        const path = window.location.pathname;
        const slug = path.split('/').filter(Boolean).pop();

        // Fetch tools data
        const response = await fetch('/data/tools.json');
        const tools = await response.json();

        // Find current tool
        const currentTool = tools.find(t => t.slug === slug);
        if (!currentTool || !currentTool.category) return;

        // Find related tools (same category, exclude current)
        const NOINDEX = new Set([
            'image-blur', 'image-sharpen', 'image-grayscale', 'image-brightness',
            'image-contrast', 'image-saturation', 'image-invert', 'image-sepia'
        ]);
        const related = tools.filter(t =>
            t.category === currentTool.category && t.slug !== slug && !NOINDEX.has(t.slug)
        );

        let displayTools = related.length > 0
            ? related.slice(0, 4)
            : tools.filter(t => t.slug !== slug && !NOINDEX.has(t.slug)).slice(0, 4);

        if (displayTools.length === 0) {
            container.innerHTML = '<p>No related tools found.</p>';
            return;
        }

        // Build HTML
        let html = '<ul style="list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px;">';
        function escapeHtml(value) {
            return String(value == null ? '' : value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }
        function safeSlug(value) {
            var s = String(value || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
            return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) ? s : '';
        }
        displayTools.forEach(tool => {
            var slug = safeSlug(tool.slug);
            if (!slug) return;
            html += `
                <li style="margin: 5px;">
                    <a href="/tools/${slug}/" style="display: inline-block; padding: 8px 12px; background: #1e293b; color: #e6edf7; text-decoration: none; border-radius: 4px;">
                        ${escapeHtml(tool.title)}
                    </a>
                </li>
            `;
        });
        html += '</ul>';
        container.innerHTML = html;
    } catch (err) {
        console.error('Related tools error:', err);
        // Keep any static HTML already in the container.
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', loadRelatedTools);
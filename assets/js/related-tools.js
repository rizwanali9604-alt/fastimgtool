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
        const related = tools.filter(t => 
            t.category === currentTool.category && t.slug !== slug
        );

        // If no related, show up to 3 random other tools
        let displayTools = related.length > 0 ? related : tools.filter(t => t.slug !== slug).slice(0, 3);

        if (displayTools.length === 0) {
            container.innerHTML = '<p>No related tools found.</p>';
            return;
        }

        // Build HTML
        let html = '<ul style="list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px;">';
        displayTools.forEach(tool => {
            html += `
                <li style="margin: 5px;">
                    <a href="/tools/${tool.slug}/" style="display: inline-block; padding: 8px 12px; background: #1e293b; color: #e6edf7; text-decoration: none; border-radius: 4px;">
                        ${tool.title}
                    </a>
                </li>
            `;
        });
        html += '</ul>';
        container.innerHTML = html;
    } catch (err) {
        console.error('Related tools error:', err);
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', loadRelatedTools);
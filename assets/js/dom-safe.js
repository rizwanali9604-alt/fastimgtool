/**
 * Safe HTML / URL helpers for client-side rendering from JSON data.
 */
(function (global) {
    'use strict';

    function escapeHtml(value) {
        if (value == null) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeAttr(value) {
        if (value == null) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /** Allow only path-safe slug segments (tools, data-tool-slug). */
    function safeSlug(value) {
        if (value == null) return '';
        var s = String(value).toLowerCase().replace(/[^a-z0-9-]/g, '');
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) ? s : '';
    }

    /** href must be same-origin path starting with / */
    function safeGuideUrl(url) {
        if (url == null) return '#';
        var u = String(url).trim();
        if (/^\/[a-zA-Z0-9/_.-]+$/.test(u) && !u.includes('..')) return u;
        return '#';
    }

    global.FastImgEscape = {
        escapeHtml: escapeHtml,
        escapeAttr: escapeAttr,
        safeSlug: safeSlug,
        safeGuideUrl: safeGuideUrl
    };
})(typeof window !== 'undefined' ? window : this);

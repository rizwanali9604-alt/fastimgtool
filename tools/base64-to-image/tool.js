(function () {
    'use strict';
    var FT = window.FastImgTool;
    var fileInput = document.getElementById('fileInput');
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');
    var toolBox = document.querySelector('.tool-box');

    var textarea = document.createElement('textarea');
    textarea.rows = 6;
    textarea.placeholder = 'Paste a data URL here (data:image/png;base64,…) or raw base64';
    textarea.style.width = '100%';
    textarea.style.marginBottom = '12px';
    textarea.style.padding = '12px';
    textarea.style.background = '#1e293b';
    textarea.style.color = '#e6edf7';
    textarea.style.border = '1px solid #334155';
    textarea.style.borderRadius = '8px';
    textarea.style.fontFamily = 'monospace';

    var status = document.createElement('p');
    status.style.color = '#94a3b8';
    status.style.fontSize = '0.9rem';

    if (toolBox && fileInput) {
        toolBox.insertBefore(textarea, fileInput);
        toolBox.insertBefore(status, fileInput);
    }

    if (fileInput) fileInput.style.display = 'none';

    downloadBtn.textContent = 'Convert & Download';

    function normalizeBase64(input) {
        var s = input.trim();
        if (!s) return '';
        if (s.startsWith('data:image/')) return s;
        return 'data:image/png;base64,' + s.replace(/^data:.*;base64,/, '');
    }

    textarea.addEventListener('input', FT.debounce(function () {
        var data = normalizeBase64(textarea.value);
        if (!data.startsWith('data:image/')) {
            preview.innerHTML = '';
            status.textContent = '';
            return;
        }
        status.textContent = 'Preview loading…';
        FT.loadImageFromUrl(data)
            .then(function (img) {
                FT.showPreviewImage(preview, img);
                status.textContent = 'Ready to download.';
            })
            .catch(function () {
                preview.innerHTML = '';
                status.textContent = 'Invalid image data.';
            });
    }, 300));

    downloadBtn.addEventListener('click', function () {
        var data = normalizeBase64(textarea.value);
        if (!data.startsWith('data:image/')) {
            alert('Paste a valid base64 image string (data:image/…;base64,…).');
            return;
        }

        downloadBtn.disabled = true;
        status.textContent = 'Processing…';

        FT.loadImageFromUrl(data)
            .then(function (img) {
                var mimeMatch = data.match(/data:([^;]+);/);
                var mime = mimeMatch ? mimeMatch[1] : 'image/png';
                var ext = mime.split('/')[1] || 'png';
                var canvas = FT.imageToCanvas(img);
                return FT.downloadCanvas(canvas, 'decoded.' + ext, mime).then(function () {
                    status.textContent = 'Download started.';
                });
            })
            .catch(function (err) {
                console.error(err);
                alert('Could not decode image.');
                status.textContent = '';
            })
            .finally(function () {
                downloadBtn.disabled = false;
            });
    });
})();

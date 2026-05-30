(function () {
    'use strict';
    var FT = window.FastImgTool;
    var fileInput = document.getElementById('fileInput');
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');
    var toolBox = document.querySelector('.tool-box');

    var textarea = document.createElement('textarea');
    textarea.rows = 8;
    textarea.readOnly = true;
    textarea.placeholder = 'Base64 output appears here after you upload an image…';
    textarea.style.width = '100%';
    textarea.style.marginTop = '12px';
    textarea.style.padding = '12px';
    textarea.style.background = '#1e293b';
    textarea.style.color = '#e6edf7';
    textarea.style.border = '1px solid #334155';
    textarea.style.borderRadius = '8px';
    textarea.style.fontFamily = 'monospace';
    textarea.style.fontSize = '0.85rem';

    if (toolBox && preview) {
        toolBox.insertBefore(textarea, preview.nextSibling);
    } else if (toolBox) {
        toolBox.appendChild(textarea);
    }

    downloadBtn.textContent = 'Download .txt';

    FT.setupImageTool({
        fileInput: fileInput,
        preview: preview,
        onLoad: function (result) {
            var reader = new FileReader();
            reader.onload = function (ev) {
                textarea.value = ev.target.result;
            };
            reader.readAsDataURL(result.file);
        }
    });

    downloadBtn.addEventListener('click', function () {
        if (!textarea.value) {
            alert('Please upload an image first.');
            return;
        }
        var blob = new Blob([textarea.value], { type: 'text/plain' });
        FT.downloadBlob(blob, 'base64.txt');
    });
})();

(function () {
    'use strict';
    var FT = window.FastImgTool;
    var fileInput = document.getElementById('fileInput');
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');
    var originalImage = null;
    var currentFile = null;

    var controls = document.createElement('div');
    controls.className = 'ft-controls';
    controls.innerHTML =
        '<div class="ft-row" style="display:flex;gap:12px;flex-wrap:wrap;">' +
        '<div><label for="cropWidth">Crop width (px)</label><input type="number" id="cropWidth" min="1"></div>' +
        '<div><label for="cropHeight">Crop height (px)</label><input type="number" id="cropHeight" min="1"></div>' +
        '</div>' +
        '<p style="font-size:0.9rem;color:#94a3b8;">Crops from the center of the image.</p>';
    FT.insertBeforeAction(controls, downloadBtn);

    var cropWidth = document.getElementById('cropWidth');
    var cropHeight = document.getElementById('cropHeight');

    function cropToCanvas(img, cw, ch) {
        cw = Math.min(cw, img.width);
        ch = Math.min(ch, img.height);
        var sx = (img.width - cw) / 2;
        var sy = (img.height - ch) / 2;
        var canvas = document.createElement('canvas');
        canvas.width = cw;
        canvas.height = ch;
        canvas.getContext('2d').drawImage(img, sx, sy, cw, ch, 0, 0, cw, ch);
        return canvas;
    }

    function renderPreview() {
        if (!originalImage) return;
        var cw = parseInt(cropWidth.value, 10);
        var ch = parseInt(cropHeight.value, 10);
        if (!cw || !ch) return;
        FT.showPreviewCanvas(preview, cropToCanvas(originalImage, cw, ch));
    }

    cropWidth.addEventListener('input', renderPreview);
    cropHeight.addEventListener('input', renderPreview);

    FT.setupImageTool({
        fileInput: fileInput,
        preview: preview,
        showPreview: false,
        onLoad: function (result) {
            originalImage = result.image;
            currentFile = result.file;
            cropWidth.value = originalImage.width;
            cropHeight.value = originalImage.height;
            renderPreview();
        }
    });

    downloadBtn.addEventListener('click', function () {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }
        var cw = parseInt(cropWidth.value, 10);
        var ch = parseInt(cropHeight.value, 10);
        if (!cw || !ch || cw < 1 || ch < 1) {
            alert('Enter valid crop dimensions.');
            return;
        }
        var canvas = cropToCanvas(originalImage, cw, ch);
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'cropped') + '.png', 'image/png');
    });
})();

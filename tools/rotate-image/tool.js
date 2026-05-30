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
        '<div class="ft-row"><label for="angleSelect">Rotation</label>' +
        '<select id="angleSelect">' +
        '<option value="90">90° clockwise</option>' +
        '<option value="180">180°</option>' +
        '<option value="270">90° counter-clockwise</option>' +
        '</select></div>';
    FT.insertBeforeAction(controls, downloadBtn);

    var angleSelect = document.getElementById('angleSelect');

    function rotateToCanvas(img, angle) {
        var radians = (angle * Math.PI) / 180;
        var w = img.width;
        var h = img.height;
        var newW = angle === 90 || angle === 270 ? h : w;
        var newH = angle === 90 || angle === 270 ? w : h;
        var canvas = document.createElement('canvas');
        canvas.width = newW;
        canvas.height = newH;
        var ctx = canvas.getContext('2d');
        ctx.translate(newW / 2, newH / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -w / 2, -h / 2);
        return canvas;
    }

    function renderPreview() {
        if (!originalImage) return;
        var angle = parseInt(angleSelect.value, 10);
        FT.showPreviewCanvas(preview, rotateToCanvas(originalImage, angle));
    }

    angleSelect.addEventListener('change', renderPreview);

    FT.setupImageTool({
        fileInput: fileInput,
        preview: preview,
        showPreview: false,
        onLoad: function (result) {
            originalImage = result.image;
            currentFile = result.file;
            renderPreview();
        }
    });

    downloadBtn.addEventListener('click', function () {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }
        var angle = parseInt(angleSelect.value, 10);
        var canvas = rotateToCanvas(originalImage, angle);
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'rotated') + '.png', 'image/png');
    });
})();

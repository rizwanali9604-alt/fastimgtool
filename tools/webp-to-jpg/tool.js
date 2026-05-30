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
        '<div class="ft-row"><label>JPEG quality: <span id="qualityValue">92</span>%</label>' +
        '<input type="range" id="qualitySlider" min="10" max="100" value="92"></div>';
    FT.insertBeforeAction(controls, downloadBtn);

    var qualitySlider = document.getElementById('qualitySlider');
    var qualityValue = document.getElementById('qualityValue');
    qualitySlider.addEventListener('input', function () {
        qualityValue.textContent = qualitySlider.value;
    });

    FT.setupImageTool({
        fileInput: fileInput,
        preview: preview,
        accept: { types: ['image/webp'], exts: ['.webp'] },
        invalidMessage: 'Please select a WebP image.',
        onLoad: function (result) {
            originalImage = result.image;
            currentFile = result.file;
        }
    });

    downloadBtn.addEventListener('click', function () {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }
        var canvas = FT.imageToCanvas(originalImage);
        var q = parseInt(qualitySlider.value, 10) / 100;
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'converted') + '.jpg', 'image/jpeg', q);
    });
})();

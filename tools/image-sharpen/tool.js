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
        '<div class="ft-row"><label>Sharpen: <span id="sharpenValue">1.0</span></label>' +
        '<input type="range" id="sharpenSlider" min="0.5" max="3" step="0.1" value="1"></div>';
    FT.insertBeforeAction(controls, downloadBtn);

    var sharpenSlider = document.getElementById('sharpenSlider');
    var sharpenValue = document.getElementById('sharpenValue');

    function renderPreview() {
        if (!originalImage) return;
        sharpenValue.textContent = sharpenSlider.value;
        var canvas = FT.imageToCanvas(originalImage);
        var ctx = canvas.getContext('2d');
        FT.applySharpen(ctx, canvas.width, canvas.height, parseFloat(sharpenSlider.value));
        FT.showPreviewCanvas(preview, canvas);
    }

    sharpenSlider.addEventListener('input', FT.debounce(renderPreview, 120));

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
        var canvas = FT.imageToCanvas(originalImage);
        var ctx = canvas.getContext('2d');
        FT.applySharpen(ctx, canvas.width, canvas.height, parseFloat(sharpenSlider.value));
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'sharpened') + '.png', 'image/png');
    });
})();

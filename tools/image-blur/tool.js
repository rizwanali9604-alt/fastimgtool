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
        '<div class="ft-row"><label>Blur: <span id="blurValue">5</span> px</label>' +
        '<input type="range" id="blurSlider" min="1" max="25" value="5"></div>';
    FT.insertBeforeAction(controls, downloadBtn);

    var blurSlider = document.getElementById('blurSlider');
    var blurValue = document.getElementById('blurValue');

    function renderPreview() {
        if (!originalImage) return;
        var px = parseInt(blurSlider.value, 10);
        blurValue.textContent = String(px);
        var canvas = FT.drawWithFilter(originalImage, 'blur(' + px + 'px)');
        FT.showPreviewCanvas(preview, canvas);
    }

    blurSlider.addEventListener('input', FT.debounce(renderPreview, 80));

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
        var px = parseInt(blurSlider.value, 10);
        var canvas = FT.drawWithFilter(originalImage, 'blur(' + px + 'px)');
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'blurred') + '.png', 'image/png');
    });
})();

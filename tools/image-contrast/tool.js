(function () {
    'use strict';
    var FT = window.FastImgTool;
    var fileInput = document.getElementById('fileInput');
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');
    var originalImage = null;
    var currentFile = null;
    var previewEl = null;

    var controls = document.createElement('div');
    controls.className = 'ft-controls';
    controls.innerHTML =
        '<div class="ft-row"><label>Contrast: <span id="contrastValue">0</span></label>' +
        '<input type="range" id="contrastSlider" min="-100" max="100" value="0"></div>';
    FT.insertBeforeAction(controls, downloadBtn);

    var slider = document.getElementById('contrastSlider');
    var label = document.getElementById('contrastValue');

    function filterCss() {
        return 'contrast(' + (100 + parseInt(slider.value, 10)) + '%)';
    }

    function updatePreview() {
        label.textContent = slider.value;
        FT.applyCssFilter(previewEl, filterCss());
    }

    slider.addEventListener('input', updatePreview);

    FT.setupImageTool({
        fileInput: fileInput,
        preview: preview,
        onLoad: function (result, state) {
            originalImage = result.image;
            currentFile = result.file;
            previewEl = state.previewEl;
            updatePreview();
        }
    });

    downloadBtn.addEventListener('click', function () {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }
        var canvas = FT.drawWithFilter(originalImage, filterCss());
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'contrast') + '.png', 'image/png');
    });
})();

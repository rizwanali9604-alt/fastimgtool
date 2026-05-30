(function () {
    'use strict';
    var FT = window.FastImgTool;
    var fileInput = document.getElementById('fileInput');
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');
    var originalImage = null;
    var currentFile = null;
    var previewEl = null;

    function filterCss() {
        return 'grayscale(100%)';
    }

    function updatePreview() {
        FT.applyCssFilter(previewEl, filterCss());
    }

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
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'grayscale') + '.png', 'image/png');
    });
})();

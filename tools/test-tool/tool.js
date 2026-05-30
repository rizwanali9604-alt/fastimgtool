(function () {
    'use strict';
    var FT = window.FastImgTool;
    var fileInput = document.getElementById('fileInput');
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');

    downloadBtn.textContent = 'Download PNG copy';

    var api = FT.setupImageTool({
        fileInput: fileInput,
        preview: preview
    });

    downloadBtn.addEventListener('click', function () {
        var state = api.getState();
        if (!state.image) {
            alert('Upload an image to verify the tool pipeline.');
            return;
        }
        var canvas = FT.imageToCanvas(state.image);
        FT.downloadCanvas(canvas, FT.baseName(state.file, 'test') + '.png', 'image/png');
    });
})();

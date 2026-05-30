(function () {
    'use strict';
    var FT = window.FastImgTool;
    var fileInput = document.getElementById('fileInput');
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');
    var originalImage = null;
    var currentFile = null;

    FT.setupImageTool({
        fileInput: fileInput,
        preview: preview,
        accept: { types: ['image/gif'], exts: ['.gif'] },
        invalidMessage: 'Please select a GIF image (first frame will be converted).',
        onLoad: function (result) {
            originalImage = result.image;
            currentFile = result.file;
        }
    });

    downloadBtn.addEventListener('click', function () {
        if (!originalImage) {
            alert('Please upload a GIF first.');
            return;
        }
        var canvas = FT.imageToCanvas(originalImage);
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'frame') + '.png', 'image/png');
    });
})();

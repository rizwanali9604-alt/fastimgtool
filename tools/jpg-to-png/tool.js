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
        accept: { types: ['image/jpeg'], exts: ['.jpg', '.jpeg', '.jpe'] },
        invalidMessage: 'Please select a JPG/JPEG image.',
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
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'converted') + '.png', 'image/png');
    });
})();

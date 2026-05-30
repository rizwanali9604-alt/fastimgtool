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
        '<div class="ft-row">' +
        '<label><input type="radio" name="flip" value="horizontal" checked> Flip horizontal</label> ' +
        '<label style="margin-left:12px;"><input type="radio" name="flip" value="vertical"> Flip vertical</label>' +
        '</div>';
    FT.insertBeforeAction(controls, downloadBtn);

    var flipRadios = document.getElementsByName('flip');

    function getFlipMode() {
        for (var i = 0; i < flipRadios.length; i++) {
            if (flipRadios[i].checked) return flipRadios[i].value;
        }
        return 'horizontal';
    }

    function flipToCanvas(img, mode) {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        var h = mode === 'horizontal';
        var v = mode === 'vertical';
        ctx.translate(h ? canvas.width : 0, v ? canvas.height : 0);
        ctx.scale(h ? -1 : 1, v ? -1 : 1);
        ctx.drawImage(img, 0, 0);
        return canvas;
    }

    function renderPreview() {
        if (!originalImage) return;
        FT.showPreviewCanvas(preview, flipToCanvas(originalImage, getFlipMode()));
    }

    Array.prototype.forEach.call(flipRadios, function (radio) {
        radio.addEventListener('change', renderPreview);
    });

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
        var canvas = flipToCanvas(originalImage, getFlipMode());
        FT.downloadCanvas(canvas, FT.baseName(currentFile, 'flipped') + '.png', 'image/png');
    });
})();

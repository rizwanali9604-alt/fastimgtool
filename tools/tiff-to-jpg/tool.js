(function () {
    'use strict';
    var FT = window.FastImgTool;
    var fileInput = document.getElementById('fileInput');
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');
    var sourceCanvas = null;
    var currentFile = null;

    var controls = document.createElement('div');
    controls.className = 'ft-controls';
    controls.innerHTML =
        '<div class="ft-row"><label>JPEG quality: <span id="qualityValue">90</span>%</label>' +
        '<input type="range" id="qualitySlider" min="10" max="100" value="90"></div>';
    FT.insertBeforeAction(controls, downloadBtn);

    var qualitySlider = document.getElementById('qualitySlider');
    var qualityValue = document.getElementById('qualityValue');
    qualitySlider.addEventListener('input', function () {
        qualityValue.textContent = qualitySlider.value;
    });

    function loadUTIF() {
        if (typeof UTIF !== 'undefined') return Promise.resolve();
        return FT.loadScript('https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.min.js');
    }

    fileInput.addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!FT.matchesFile(file, { exts: ['.tif', '.tiff'] })) {
            alert('Please select a TIFF file (.tif or .tiff).');
            return;
        }

        currentFile = file;
        sourceCanvas = null;
        preview.innerHTML = '<p style="color:#94a3b8;">Decoding TIFF…</p>';
        downloadBtn.disabled = true;

        loadUTIF()
            .then(function () {
                return file.arrayBuffer();
            })
            .then(function (arrayBuffer) {
                var ifds = UTIF.decode(arrayBuffer);
                if (!ifds || !ifds.length) throw new Error('No image data in TIFF');
                UTIF.decodeImage(arrayBuffer, ifds[0]);
                var rgba = UTIF.toRGBA8(ifds[0]);
                var canvas = document.createElement('canvas');
                canvas.width = ifds[0].width;
                canvas.height = ifds[0].height;
                var ctx = canvas.getContext('2d');
                var imageData = ctx.createImageData(canvas.width, canvas.height);
                imageData.data.set(rgba);
                ctx.putImageData(imageData, 0, 0);
                sourceCanvas = canvas;
                FT.showPreviewCanvas(preview, canvas);
                downloadBtn.disabled = false;
            })
            .catch(function (err) {
                console.error(err);
                preview.innerHTML = '<p style="color:#f87171;">Failed to decode TIFF.</p>';
            });
    });

    downloadBtn.addEventListener('click', function () {
        if (!sourceCanvas) {
            alert('Please upload a TIFF file first.');
            return;
        }
        var q = parseInt(qualitySlider.value, 10) / 100;
        FT.downloadCanvas(sourceCanvas, FT.baseName(currentFile, 'converted') + '.jpg', 'image/jpeg', q);
    });
})();

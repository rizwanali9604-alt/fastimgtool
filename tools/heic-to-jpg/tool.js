(function () {
    'use strict';
    var FT = window.FastImgTool;
    var fileInput = document.getElementById('fileInput');
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');
    var convertedBlob = null;
    var currentFile = null;

    var controls = document.createElement('div');
    controls.className = 'ft-controls';
    controls.innerHTML =
        '<div class="ft-row"><label>JPEG quality: <span id="qualityValue">90</span>%</label>' +
        '<input type="range" id="qualitySlider" min="50" max="100" value="90"></div>';
    FT.insertBeforeAction(controls, downloadBtn);

    var qualitySlider = document.getElementById('qualitySlider');
    var qualityValue = document.getElementById('qualityValue');
    qualitySlider.addEventListener('input', function () {
        qualityValue.textContent = qualitySlider.value;
    });

    function ensureHeic2Any() {
        if (typeof heic2any !== 'undefined') return Promise.resolve();
        return FT.loadScript('/assets/vendor/heic2any.min.js');
    }

    function convertHeic(file) {
        currentFile = file;
        convertedBlob = null;
        preview.innerHTML = '<p style="color:#94a3b8;">Converting HEIC…</p>';
        downloadBtn.disabled = true;

        return ensureHeic2Any()
            .then(function () {
                if (typeof heic2any === 'undefined') throw new Error('HEIC library missing');
                var q = parseInt(qualitySlider.value, 10) / 100;
                return heic2any({ blob: file, toType: 'image/jpeg', quality: q });
            })
            .then(function (result) {
                convertedBlob = Array.isArray(result) ? result[0] : result;
                return FT.loadImageFromUrl(URL.createObjectURL(convertedBlob));
            })
            .then(function (img) {
                FT.showPreviewImage(preview, img);
                downloadBtn.disabled = false;
            })
            .catch(function (err) {
                console.error(err);
                preview.innerHTML = '<p style="color:#f87171;">Conversion failed. Try another file or use Chrome/Edge.</p>';
                downloadBtn.disabled = true;
            });
    }

    fileInput.addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!FT.matchesFile(file, { exts: ['.heic', '.heif'], types: ['image/heic', 'image/heif'] })) {
            alert('Please select a HEIC/HEIF file (.heic).');
            return;
        }

        convertHeic(file);
    });

    qualitySlider.addEventListener('change', function () {
        if (currentFile) convertHeic(currentFile);
    });

    downloadBtn.addEventListener('click', function () {
        if (!convertedBlob) {
            alert('Please convert a HEIC image first.');
            return;
        }
        FT.downloadBlob(convertedBlob, FT.baseName(currentFile, 'converted') + '.jpg');
    });
})();

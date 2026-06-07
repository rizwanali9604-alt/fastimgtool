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
        '<div class="ft-row"><label style="font-weight:600;font-size:14px;display:block;margin-bottom:8px;">Quick Presets</label>' +
        '<div class="preset-row" style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<button type="button" class="preset-btn" data-w="600" data-h="600">Meesho 600×600</button>' +
        '<button type="button" class="preset-btn" data-w="1000" data-h="1000">Amazon 1000×1000</button>' +
        '<button type="button" class="preset-btn" data-w="1080" data-h="1080">Instagram 1080×1080</button>' +
        '<button type="button" class="preset-btn" data-w="1280" data-h="720">HD 1280×720</button>' +
        '<button type="button" class="preset-btn" data-w="1920" data-h="1080">Full HD 1920×1080</button>' +
        '</div></div>' +
        '<div class="ft-row" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;">' +
        '<div><label for="widthInput">Width (px)</label><input type="number" id="widthInput" min="1"></div>' +
        '<div><label for="heightInput">Height (px)</label><input type="number" id="heightInput" min="1"></div>' +
        '</div>' +
        '<div class="ft-row"><label><input type="checkbox" id="lockAspect" checked> Lock aspect ratio</label></div>';
    FT.insertBeforeAction(controls, downloadBtn);

    var widthInput = document.getElementById('widthInput');
    var heightInput = document.getElementById('heightInput');
    var lockAspect = document.getElementById('lockAspect');

    function updatePreviewCanvas() {
        if (!originalImage) return;
        var w = parseInt(widthInput.value, 10);
        var h = parseInt(heightInput.value, 10);
        if (!w || !h) return;
        var canvas = FT.drawWithFilter(originalImage, 'none', w, h);
        FT.showPreviewCanvas(preview, canvas);
    }

    widthInput.addEventListener('input', function () {
        if (lockAspect.checked && originalImage) {
            var ratio = originalImage.height / originalImage.width;
            heightInput.value = Math.max(1, Math.round(widthInput.value * ratio));
        }
        updatePreviewCanvas();
    });

    heightInput.addEventListener('input', function () {
        if (lockAspect.checked && originalImage) {
            var ratio = originalImage.width / originalImage.height;
            widthInput.value = Math.max(1, Math.round(heightInput.value * ratio));
        }
        updatePreviewCanvas();
    });

    document.querySelectorAll('.preset-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            widthInput.value = btn.getAttribute('data-w');
            heightInput.value = btn.getAttribute('data-h');
            lockAspect.checked = false;
            updatePreviewCanvas();
        });
    });

    FT.setupImageTool({
        fileInput: fileInput,
        preview: preview,
        showPreview: false,
        onLoad: function (result) {
            originalImage = result.image;
            currentFile = result.file;
            widthInput.value = originalImage.width;
            heightInput.value = originalImage.height;
            updatePreviewCanvas();
        }
    });

    downloadBtn.addEventListener('click', function () {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }
        var w = parseInt(widthInput.value, 10);
        var h = parseInt(heightInput.value, 10);
        if (!w || !h || w < 1 || h < 1) {
            alert('Enter valid dimensions.');
            return;
        }
        var canvas = FT.drawWithFilter(originalImage, 'none', w, h);
        var name = FT.baseName(currentFile, 'image') + '-' + w + 'x' + h + '.jpg';
        FT.downloadCanvas(canvas, name, 'image/jpeg', 0.92);
    });
})();

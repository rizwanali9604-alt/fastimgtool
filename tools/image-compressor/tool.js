/**
 * Image compressor — browser-image-compression (Web Worker) + adaptive targets for real size reduction.
 */
(function () {
    'use strict';

    var icLib = typeof imageCompression !== 'undefined' ? imageCompression : null;

    var fileInput = document.getElementById('fileInput');
    var dropzone = document.getElementById('icDropzone');
    var preview = document.getElementById('preview');
    var controlsEl = document.getElementById('icControls');
    var qualitySlider = document.getElementById('qualitySlider');
    var qualityValue = document.getElementById('qualityValue');
    var formatSelect = document.getElementById('formatSelect');
    var maxSideSelect = document.getElementById('maxSideSelect');
    var icStats = document.getElementById('icStats');
    var icProgressWrap = document.getElementById('icProgressWrap');
    var icProgressBar = document.getElementById('icProgressBar');
    var icProgressLabel = document.getElementById('icProgressLabel');
    var compressBtn = document.getElementById('compressBtn');

    var currentFile = null;
    var previewObjectUrl = null;
    var compressedObjectUrl = null;

    /** Same-origin script URL for Web Worker importScripts */
    function libUrl() {
        return new URL('/assets/vendor/browser-image-compression.js', window.location.href).href;
    }

    function formatBytes(n) {
        if (n < 1024) return n + ' B';
        if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
        return (n / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function revokePreview() {
        if (previewObjectUrl) {
            URL.revokeObjectURL(previewObjectUrl);
            previewObjectUrl = null;
        }
        if (compressedObjectUrl) {
            URL.revokeObjectURL(compressedObjectUrl);
            compressedObjectUrl = null;
        }
    }

    function showOriginalPreview(file) {
        revokePreview();
        preview.innerHTML = '';
        previewObjectUrl = URL.createObjectURL(file);
        var img = document.createElement('img');
        img.src = previewObjectUrl;
        img.alt = 'Original image preview';
        img.className = 'ic-preview-img';
        preview.appendChild(img);
    }

    function setProgress(p) {
        var v = Math.round(Math.min(100, Math.max(0, p)));
        icProgressBar.style.width = v + '%';
        icProgressBar.setAttribute('aria-valuenow', String(v));
        icProgressLabel.textContent = v + '%';
    }

    function buildCompressionOptions(file) {
        var origMB = file.size / (1024 * 1024);
        var targetMB = origMB * 0.49;
        var q = Number(qualitySlider.value) / 100;
        q = Math.min(0.96, Math.max(0.55, q));

        return {
            maxSizeMB: Math.max(targetMB, 0.02),
            maxWidthOrHeight: parseInt(maxSideSelect.value, 10),
            useWebWorker: true,
            libURL: libUrl(),
            initialQuality: q,
            fileType: formatSelect.value,
            maxIteration: 12,
            preserveExif: false,
            onProgress: function (progress) {
                setProgress(progress);
            }
        };
    }

    function onFileChosen(file) {
        if (!file || !/^image\//.test(file.type)) {
            alert('Please choose a valid image file.');
            return;
        }
        var maxWarn = 80 * 1024 * 1024;
        if (file.size > maxWarn) {
            if (!confirm('This file is very large (' + formatBytes(file.size) + '). Compression may take a while and use significant memory. Continue?')) {
                return;
            }
        }

        currentFile = file;
        showOriginalPreview(file);
        controlsEl.hidden = false;
        icStats.hidden = true;
        icStats.textContent = '';
        compressBtn.disabled = false;
        updateFormatHint();
    }

    function updateFormatHint() {
        if (!formatSelect || !currentFile) return;
        if (currentFile.type === 'image/png' && formatSelect.value === 'image/jpeg') {
            formatSelect.title =
                'JPEG does not support transparency; transparent areas become white (standard behavior).';
        } else {
            formatSelect.title = '';
        }
    }

    function wireFileInput() {
        fileInput.addEventListener('change', function (e) {
            var f = e.target.files && e.target.files[0];
            if (f) onFileChosen(f);
        });
    }

    function wireDropzone() {
        if (!dropzone) return;
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (ev) {
            dropzone.addEventListener(ev, function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        dropzone.addEventListener('dragover', function () {
            dropzone.classList.add('ic-dropzone--active');
        });
        dropzone.addEventListener('dragleave', function () {
            dropzone.classList.remove('ic-dropzone--active');
        });
        dropzone.addEventListener('drop', function (e) {
            dropzone.classList.remove('ic-dropzone--active');
            var f = e.dataTransfer.files && e.dataTransfer.files[0];
            if (f) onFileChosen(f);
        });
    }

    qualitySlider.addEventListener('input', function () {
        qualityValue.textContent = qualitySlider.value;
    });

    if (formatSelect) {
        formatSelect.addEventListener('change', updateFormatHint);
    }

    compressBtn.addEventListener('click', function () {
        if (!icLib) {
            alert('Compression library failed to load. Please refresh the page.');
            return;
        }
        if (!currentFile) {
            alert('Please upload an image first.');
            return;
        }

        compressBtn.disabled = true;
        icProgressWrap.hidden = false;
        setProgress(0);
        icStats.hidden = true;

        var origSize = currentFile.size;
        var opts = buildCompressionOptions(currentFile);

        icLib(currentFile, opts)
            .then(function (outFile) {
                var newSize = outFile.size;
                var ratio = origSize > 0 ? (1 - newSize / origSize) * 100 : 0;
                var line = document.createElement('div');
                line.className = 'ic-stats-line';
                line.innerHTML =
                    '<strong>Before:</strong> ' +
                    formatBytes(origSize) +
                    ' &nbsp;|&nbsp; <strong>After:</strong> ' +
                    formatBytes(newSize) +
                    ' &nbsp;|&nbsp; <strong>Saved:</strong> ' +
                    ratio.toFixed(1) +
                    '%';

                if (ratio < 50 && origSize > 5000) {
                    var hint = document.createElement('p');
                    hint.className = 'ic-stats-hint';
                    hint.textContent =
                        'This file was already small or highly optimized. Try WebP/JPEG, a lower max side, or quality ~75–85% for more savings.';
                    icStats.innerHTML = '';
                    icStats.appendChild(line);
                    icStats.appendChild(hint);
                } else {
                    icStats.innerHTML = '';
                    icStats.appendChild(line);
                }
                icStats.hidden = false;

                if (compressedObjectUrl) URL.revokeObjectURL(compressedObjectUrl);
                compressedObjectUrl = URL.createObjectURL(outFile);
                preview.innerHTML = '';
                var img = document.createElement('img');
                img.src = compressedObjectUrl;
                img.alt = 'Compressed preview';
                img.className = 'ic-preview-img';
                preview.appendChild(img);

                var ext = 'jpg';
                if (opts.fileType === 'image/png') ext = 'png';
                else if (opts.fileType === 'image/webp') ext = 'webp';

                var base = (currentFile.name && currentFile.name.replace(/\.[^/.]+$/, '')) || 'image';
                var a = document.createElement('a');
                a.href = compressedObjectUrl;
                a.download = base + '-compressed.' + ext;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(function (err) {
                console.error(err);
                var msg =
                    (err && err.message) ||
                    'Compression failed. The image may be too large for this browser — try a smaller file or a different format.';
                if (formatSelect && formatSelect.value === 'image/webp') {
                    msg += ' Try switching output format to JPEG if WebP is not supported here.';
                }
                alert(msg);
            })
            .finally(function () {
                compressBtn.disabled = false;
                icProgressWrap.hidden = true;
                setProgress(0);
            });
    });

    wireFileInput();
    wireDropzone();

    if (!icLib) {
        compressBtn.disabled = true;
        if (controlsEl) controlsEl.hidden = false;
        var err = document.createElement('p');
        err.className = 'ic-error';
        err.textContent = 'Error: compression library not loaded. Check that /assets/vendor/browser-image-compression.js is available.';
        var box = document.querySelector('.image-compressor-box');
        if (box) box.insertBefore(err, box.firstChild);
    }
})();

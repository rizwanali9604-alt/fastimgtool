(function () {
    'use strict';
    var FT = window.FastImgTool;
    var preview = document.getElementById('preview');
    var downloadBtn = document.getElementById('downloadBtn');
    var textarea = document.getElementById('base64Input');
    var status = document.getElementById('base64Status');

    if (!textarea || !downloadBtn) return;

    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Convert and download';

    function normalizeBase64(input) {
        var s = (input || '').trim();
        if (!s) return '';
        if (s.startsWith('data:image/')) return s;
        return 'data:image/png;base64,' + s.replace(/^data:.*;base64,/, '');
    }

    function setReady(ok, message) {
        if (status) status.textContent = message || '';
        downloadBtn.disabled = !ok;
    }

    textarea.addEventListener('input', FT.debounce(function () {
        var data = normalizeBase64(textarea.value);
        if (!data.startsWith('data:image/') || data.length < 40) {
            preview.innerHTML = '';
            setReady(false, '');
            return;
        }
        setReady(false, 'Preview loading…');
        FT.loadImageFromUrl(data)
            .then(function (img) {
                FT.showPreviewImage(preview, img);
                setReady(true, 'Ready to download.');
            })
            .catch(function () {
                preview.innerHTML = '';
                setReady(false, 'Invalid image data.');
            });
    }, 300));

    downloadBtn.addEventListener('click', function () {
        var data = normalizeBase64(textarea.value);
        if (!data.startsWith('data:image/')) {
            setReady(false, 'Paste a valid data URL (data:image/…;base64,…) or raw base64.');
            return;
        }

        downloadBtn.disabled = true;
        if (status) status.textContent = 'Processing…';

        FT.loadImageFromUrl(data)
            .then(function (img) {
                var mimeMatch = data.match(/data:([^;]+);/);
                var mime = mimeMatch ? mimeMatch[1] : 'image/png';
                var ext = (mime.split('/')[1] || 'png').replace('+xml', '');
                var canvas = FT.imageToCanvas(img);
                return FT.downloadCanvas(canvas, 'decoded.' + ext, mime).then(function () {
                    if (status) status.textContent = 'Download started.';
                });
            })
            .catch(function (err) {
                console.error(err);
                if (status) status.textContent = 'Could not decode image.';
            })
            .finally(function () {
                downloadBtn.disabled = false;
            });
    });
})();

/**
 * Shared helpers for FastImgTool client-side image tools.
 */
(function (global) {
    'use strict';

    function debounce(fn, wait) {
        var t;
        return function () {
            var args = arguments;
            var ctx = this;
            clearTimeout(t);
            t = setTimeout(function () {
                fn.apply(ctx, args);
            }, wait);
        };
    }

    function baseName(file, fallback) {
        if (file && file.name) {
            var n = file.name.replace(/\.[^/.]+$/, '');
            if (n) return n;
        }
        return fallback || 'image';
    }

    function downloadBlob(blob, filename) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    function canvasToBlob(canvas, mime, quality) {
        return new Promise(function (resolve, reject) {
            canvas.toBlob(
                function (blob) {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to export image'));
                },
                mime,
                quality
            );
        });
    }

    function downloadCanvas(canvas, filename, mime, quality) {
        return canvasToBlob(canvas, mime, quality).then(function (blob) {
            downloadBlob(blob, filename);
        });
    }

    /**
     * Validate file by MIME type and/or extension (handles empty/wrong MIME from OS).
     */
    function matchesFile(file, options) {
        if (!file) return false;
        options = options || {};
        var type = (file.type || '').toLowerCase();
        var name = (file.name || '').toLowerCase();

        if (options.types && options.types.length) {
            for (var i = 0; i < options.types.length; i++) {
                if (type === options.types[i].toLowerCase()) return true;
            }
        }

        if (options.exts && options.exts.length) {
            for (var j = 0; j < options.exts.length; j++) {
                if (name.endsWith(options.exts[j].toLowerCase())) return true;
            }
        }

        if (!options.types && !options.exts) {
            if (/^image\//.test(type)) return true;
            return /\.(jpe?g|png|gif|webp|bmp|svg|ico|tiff?|heic|heif|avif)$/i.test(name);
        }

        return false;
    }

    function loadImageFromFile(file) {
        return new Promise(function (resolve, reject) {
            var url = URL.createObjectURL(file);
            var img = new Image();
            img.onload = function () {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = function () {
                URL.revokeObjectURL(url);
                reject(new Error('Could not decode image'));
            };
            img.src = url;
        });
    }

    function loadImageFromUrl(url) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('script[src="' + src + '"]')) {
                resolve();
                return;
            }
            var s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = function () {
                reject(new Error('Failed to load script: ' + src));
            };
            document.head.appendChild(s);
        });
    }

    function insertBeforeAction(controlsEl, actionBtn) {
        var btn = actionBtn || document.getElementById('downloadBtn') || document.getElementById('compressBtn');
        if (btn && btn.parentNode) {
            btn.parentNode.insertBefore(controlsEl, btn);
        } else {
            var box = document.querySelector('.tool-box');
            if (box) box.appendChild(controlsEl);
        }
    }

    function stylePreviewImg(img) {
        img.className = 'ft-preview-img';
        img.style.maxWidth = '100%';
        img.style.maxHeight = 'min(360px, 50vh)';
        img.style.borderRadius = '8px';
        img.style.objectFit = 'contain';
        return img;
    }

    function showPreviewImage(preview, img) {
        preview.innerHTML = '';
        var el = img.cloneNode(true);
        stylePreviewImg(el);
        preview.appendChild(el);
        return el;
    }

    function showPreviewCanvas(preview, canvas) {
        preview.innerHTML = '';
        var el = document.createElement('canvas');
        el.width = canvas.width;
        el.height = canvas.height;
        el.getContext('2d').drawImage(canvas, 0, 0);
        el.className = 'ft-preview-canvas';
        el.style.maxWidth = '100%';
        el.style.maxHeight = 'min(360px, 50vh)';
        el.style.borderRadius = '8px';
        preview.appendChild(el);
        return el;
    }

    function drawWithFilter(img, filter, w, h) {
        w = w || img.naturalWidth || img.width;
        h = h || img.naturalHeight || img.height;
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.filter = filter || 'none';
        ctx.drawImage(img, 0, 0, w, h);
        ctx.filter = 'none';
        return canvas;
    }

    function imageToCanvas(img, w, h) {
        w = w || img.naturalWidth || img.width;
        h = h || img.naturalHeight || img.height;
        return drawWithFilter(img, 'none', w, h);
    }

    function applyCssFilter(previewEl, filter) {
        if (previewEl) previewEl.style.filter = filter || 'none';
    }

    function applySharpen(ctx, width, height, intensity) {
        var imageData = ctx.getImageData(0, 0, width, height);
        var data = imageData.data;
        var copy = new Uint8ClampedArray(data);
        var center = 4 + intensity;
        var kernel = [
            [0, -1, 0],
            [-1, center, -1],
            [0, -1, 0]
        ];
        for (var y = 1; y < height - 1; y++) {
            for (var x = 1; x < width - 1; x++) {
                var r = 0;
                var g = 0;
                var b = 0;
                for (var ky = -1; ky <= 1; ky++) {
                    for (var kx = -1; kx <= 1; kx++) {
                        var weight = kernel[ky + 1][kx + 1];
                        var idx = ((y + ky) * width + (x + kx)) * 4;
                        r += copy[idx] * weight;
                        g += copy[idx + 1] * weight;
                        b += copy[idx + 2] * weight;
                    }
                }
                var o = (y * width + x) * 4;
                data[o] = Math.min(255, Math.max(0, r));
                data[o + 1] = Math.min(255, Math.max(0, g));
                data[o + 2] = Math.min(255, Math.max(0, b));
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function applyPixelBrightness(imageData, amount) {
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, data[i] + amount));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + amount));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + amount));
        }
        return imageData;
    }

    function setupImageTool(options) {
        var fileInput = options.fileInput || document.getElementById('fileInput');
        var preview = options.preview || document.getElementById('preview');
        var toolBox = (fileInput && fileInput.closest('.tool-box')) || document.querySelector('.tool-box');
        var state = { file: null, image: null, previewEl: null };

        function rejectFile(message) {
            if (options.onReject) options.onReject(message);
            else alert(message);
        }

        function handleFile(file) {
            if (!file) return;

            if (options.accept && !matchesFile(file, options.accept)) {
                rejectFile(options.invalidMessage || 'Please choose a valid file.');
                return;
            }

            if (options.maxBytes && file.size > options.maxBytes) {
                rejectFile('File is too large for this browser tool.');
                return;
            }

            var loader = options.loadAs === 'arrayBuffer'
                ? file.arrayBuffer().then(function (buf) {
                      return { file: file, buffer: buf };
                  })
                : loadImageFromFile(file).then(function (img) {
                      return { file: file, image: img };
                  });

            loader
                .then(function (result) {
                    state.file = result.file;
                    if (result.image) {
                        state.image = result.image;
                        if (preview && options.showPreview !== false) {
                            state.previewEl = showPreviewImage(preview, result.image);
                        }
                    }
                    if (options.onLoad) options.onLoad(result, state);
                })
                .catch(function () {
                    rejectFile('Could not load file. It may be corrupted or unsupported.');
                });
        }

        if (fileInput) {
            fileInput.addEventListener('change', function (e) {
                handleFile(e.target.files && e.target.files[0]);
            });
        }

        if (toolBox && options.dragDrop !== false) {
            toolBox.classList.add('ft-tool-box');
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (ev) {
                toolBox.addEventListener(ev, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            toolBox.addEventListener('dragover', function () {
                toolBox.classList.add('ft-drag-over');
            });
            toolBox.addEventListener('dragleave', function () {
                toolBox.classList.remove('ft-drag-over');
            });
            toolBox.addEventListener('drop', function (e) {
                toolBox.classList.remove('ft-drag-over');
                handleFile(e.dataTransfer.files && e.dataTransfer.files[0]);
            });
        }

        return {
            getState: function () {
                return state;
            },
            handleFile: handleFile
        };
    }

    global.FastImgTool = {
        debounce: debounce,
        baseName: baseName,
        downloadBlob: downloadBlob,
        canvasToBlob: canvasToBlob,
        downloadCanvas: downloadCanvas,
        matchesFile: matchesFile,
        loadImageFromFile: loadImageFromFile,
        loadImageFromUrl: loadImageFromUrl,
        loadScript: loadScript,
        insertBeforeAction: insertBeforeAction,
        showPreviewImage: showPreviewImage,
        showPreviewCanvas: showPreviewCanvas,
        drawWithFilter: drawWithFilter,
        imageToCanvas: imageToCanvas,
        applyCssFilter: applyCssFilter,
        applySharpen: applySharpen,
        applyPixelBrightness: applyPixelBrightness,
        setupImageTool: setupImageTool
    };
})(typeof window !== 'undefined' ? window : this);

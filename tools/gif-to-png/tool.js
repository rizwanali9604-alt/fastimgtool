// GIF to PNG Converter (first frame only)
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image/gif')) {
        alert('Please select a GIF image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            preview.innerHTML = '';
            preview.appendChild(img.cloneNode());
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

downloadBtn.addEventListener('click', function() {
    if (!originalImage) {
        alert('Please upload a GIF first.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0);

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted.png';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
});
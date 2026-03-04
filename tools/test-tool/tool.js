// Tool logic for test-tool
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let image = new Image();

fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        image.src = event.target.result;
        image.onload = () => {
            preview.innerHTML = '';
            preview.appendChild(image);
        };
    };
    reader.readAsDataURL(file);
});

downloadBtn.addEventListener('click', function () {
    if (!image.src) {
        alert('Please upload an image first.');
        return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'processed.png';
    link.href = dataUrl;
    link.click();
});

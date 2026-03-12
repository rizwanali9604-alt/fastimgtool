// Image Brightness
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Create brightness slider
const controlsDiv = document.createElement('div');
controlsDiv.style.marginTop = '15px';
controlsDiv.innerHTML = `
    <div>
        <label>Brightness: <span id="brightnessValue">0</span></label>
        <input type="range" id="brightnessSlider" min="-100" max="100" value="0" style="width:100%;">
    </div>
`;
document.querySelector('.tool-box').appendChild(controlsDiv);

const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessSpan = document.getElementById('brightnessValue');

brightnessSlider.addEventListener('input', () => {
    brightnessSpan.textContent = brightnessSlider.value;
});

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

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
        alert('Please upload an image first.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const brightness = parseInt(brightnessSlider.value);

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + brightness));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness));
    }
    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'brightness-adjusted.png';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
});
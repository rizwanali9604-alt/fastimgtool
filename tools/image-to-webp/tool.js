// Image to WEBP Converter
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Optional quality slider (since WebP supports variable quality)
const controlsDiv = document.createElement('div');
controlsDiv.style.marginTop = '15px';
controlsDiv.innerHTML = `
    <div>
        <label>Quality: <span id="qualityValue">90</span>%</label>
        <input type="range" id="qualitySlider" min="10" max="100" value="90" style="width:100%;">
    </div>
`;
document.querySelector('.tool-box').appendChild(controlsDiv);

const qualitySlider = document.getElementById('qualitySlider');
const qualitySpan = document.getElementById('qualityValue');

qualitySlider.addEventListener('input', () => {
    qualitySpan.textContent = qualitySlider.value;
});

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
        alert('Please select an image file.');
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
        alert('Please upload an image first.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0);

    const quality = qualitySlider.value / 100;
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted.webp';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/webp', quality);
});
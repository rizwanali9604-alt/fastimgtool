// Image Compressor
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Create quality slider and format selector
const controlsDiv = document.createElement('div');
controlsDiv.style.marginTop = '15px';
controlsDiv.innerHTML = `
    <div style="margin-bottom:10px;">
        <label>Quality: <span id="qualityValue">80</span>%</label>
        <input type="range" id="qualitySlider" min="10" max="100" value="80" style="width:100%;">
    </div>
    <div>
        <label>Format: </label>
        <select id="formatSelect">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
        </select>
    </div>
`;
document.querySelector('.tool-box').appendChild(controlsDiv);

const qualitySlider = document.getElementById('qualitySlider');
const qualitySpan = document.getElementById('qualityValue');
const formatSelect = document.getElementById('formatSelect');

qualitySlider.addEventListener('input', () => {
    qualitySpan.textContent = qualitySlider.value;
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
            preview.appendChild(img.cloneNode()); // show original
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
    const ctx = canvas.getContext('2d');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0);

    const quality = qualitySlider.value / 100;
    const format = formatSelect.value;
    const mimeType = format;
    const extension = format.split('/')[1];

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `compressed.${extension}`;
        link.click();
        URL.revokeObjectURL(url);
    }, mimeType, quality);
});
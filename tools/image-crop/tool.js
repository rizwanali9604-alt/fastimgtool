// Image Crop (basic – center crop with width/height inputs)
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Create crop width/height inputs
const controlsDiv = document.createElement('div');
controlsDiv.style.marginTop = '15px';
controlsDiv.innerHTML = `
    <div style="display:flex; gap:10px; margin-bottom:10px;">
        <div>
            <label>Crop Width:</label>
            <input type="number" id="cropWidth" style="width:80px;">
        </div>
        <div>
            <label>Crop Height:</label>
            <input type="number" id="cropHeight" style="width:80px;">
        </div>
    </div>
    <p style="font-size:0.9em;">Crops from the center of the image.</p>
`;
document.querySelector('.tool-box').appendChild(controlsDiv);

const cropWidth = document.getElementById('cropWidth');
const cropHeight = document.getElementById('cropHeight');

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            cropWidth.value = img.width;
            cropHeight.value = img.height;
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

    let cw = parseInt(cropWidth.value);
    let ch = parseInt(cropHeight.value);
    if (!cw || !ch || cw <= 0 || ch <= 0) {
        alert('Enter valid crop dimensions.');
        return;
    }

    // Limit to original size
    cw = Math.min(cw, originalImage.width);
    ch = Math.min(ch, originalImage.height);

    const startX = (originalImage.width - cw) / 2;
    const startY = (originalImage.height - ch) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, startX, startY, cw, ch, 0, 0, cw, ch);

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cropped.png';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
});
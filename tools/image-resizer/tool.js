// Image Resizer
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Create width/height inputs and aspect ratio lock
const controlsDiv = document.createElement('div');
controlsDiv.style.marginTop = '15px';
controlsDiv.innerHTML = `
    <div style="display:flex; gap:10px; margin-bottom:10px;">
        <div>
            <label>Width:</label>
            <input type="number" id="widthInput" style="width:80px;">
        </div>
        <div>
            <label>Height:</label>
            <input type="number" id="heightInput" style="width:80px;">
        </div>
    </div>
    <div>
        <label>
            <input type="checkbox" id="lockAspect" checked> Lock aspect ratio
        </label>
    </div>
`;
document.querySelector('.tool-box').appendChild(controlsDiv);

const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const lockAspect = document.getElementById('lockAspect');

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            widthInput.value = img.width;
            heightInput.value = img.height;
            preview.innerHTML = '';
            preview.appendChild(img.cloneNode());
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

widthInput.addEventListener('input', function() {
    if (lockAspect.checked && originalImage) {
        const ratio = originalImage.height / originalImage.width;
        heightInput.value = Math.round(widthInput.value * ratio);
    }
});

heightInput.addEventListener('input', function() {
    if (lockAspect.checked && originalImage) {
        const ratio = originalImage.width / originalImage.height;
        widthInput.value = Math.round(heightInput.value * ratio);
    }
});

downloadBtn.addEventListener('click', function() {
    if (!originalImage) {
        alert('Please upload an image first.');
        return;
    }
    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);
    if (!newWidth || !newHeight) {
        alert('Enter valid dimensions.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resized.png';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
});
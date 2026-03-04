// Image Sharpen
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Create sharpen intensity slider
const controlsDiv = document.createElement('div');
controlsDiv.style.marginTop = '15px';
controlsDiv.innerHTML = `
    <div>
        <label>Sharpen intensity: <span id="sharpenValue">1</span></label>
        <input type="range" id="sharpenSlider" min="0.5" max="3" step="0.1" value="1" style="width:100%;">
    </div>
`;
document.querySelector('.tool-box').appendChild(controlsDiv);

const sharpenSlider = document.getElementById('sharpenSlider');
const sharpenSpan = document.getElementById('sharpenValue');

sharpenSlider.addEventListener('input', () => {
    sharpenSpan.textContent = sharpenSlider.value;
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

function applySharpen(ctx, width, height, intensity) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);
    // Simple sharpen kernel
    const kernel = [
        [0, -1, 0],
        [-1, 4 + intensity, -1],
        [0, -1, 0]
    ];
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const weight = kernel[ky + 1][kx + 1];
                    const idx = ((y + ky) * width + (x + kx)) * 4;
                    r += copy[idx] * weight;
                    g += copy[idx + 1] * weight;
                    b += copy[idx + 2] * weight;
                }
            }
            const idx = (y * width + x) * 4;
            data[idx] = Math.min(255, Math.max(0, r));
            data[idx + 1] = Math.min(255, Math.max(0, g));
            data[idx + 2] = Math.min(255, Math.max(0, b));
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

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

    const intensity = parseFloat(sharpenSlider.value);
    applySharpen(ctx, canvas.width, canvas.height, intensity);

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sharpened.png';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
});
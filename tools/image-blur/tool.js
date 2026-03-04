// Image Blur
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Create blur intensity slider
const controlsDiv = document.createElement('div');
controlsDiv.style.marginTop = '15px';
controlsDiv.innerHTML = `
    <div>
        <label>Blur intensity: <span id="blurValue">5</span></label>
        <input type="range" id="blurSlider" min="1" max="20" value="5" style="width:100%;">
    </div>
`;
document.querySelector('.tool-box').appendChild(controlsDiv);

const blurSlider = document.getElementById('blurSlider');
const blurSpan = document.getElementById('blurValue');

blurSlider.addEventListener('input', () => {
    blurSpan.textContent = blurSlider.value;
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

function applyBlur(ctx, width, height, intensity) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const kernelSize = intensity * 2 + 1; // simple box blur
    // For simplicity, we'll use a basic averaging (inefficient but works for demo)
    // In practice, use a more efficient algorithm. This is a placeholder.
    // We'll just apply a simple blur by averaging neighboring pixels (quick and dirty).
    const copy = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, count = 0;
            for (let ky = -intensity; ky <= intensity; ky++) {
                for (let kx = -intensity; kx <= intensity; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = (ny * width + nx) * 4;
                        r += copy[idx];
                        g += copy[idx + 1];
                        b += copy[idx + 2];
                        count++;
                    }
                }
            }
            const idx = (y * width + x) * 4;
            data[idx] = r / count;
            data[idx + 1] = g / count;
            data[idx + 2] = b / count;
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

    const intensity = parseInt(blurSlider.value);
    applyBlur(ctx, canvas.width, canvas.height, intensity);

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'blurred.png';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
});
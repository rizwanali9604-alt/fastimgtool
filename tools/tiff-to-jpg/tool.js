// TIFF to JPG Converter with dynamic UTIF loading
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

// Quality slider
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
qualitySlider.addEventListener('input', () => qualitySpan.textContent = qualitySlider.value);

// Function to dynamically load UTIF.js
function loadUTIF() {
    return new Promise((resolve, reject) => {
        if (typeof UTIF !== 'undefined') {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

fileInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.tif') && !file.name.toLowerCase().endsWith('.tiff')) {
        alert('Please select a TIFF file.');
        return;
    }

    try {
        // Ensure UTIF is loaded
        await loadUTIF();

        const arrayBuffer = await file.arrayBuffer();

        // Decode TIFF using UTIF.js
        const ifds = UTIF.decode(arrayBuffer);
        if (!ifds || ifds.length === 0) {
            throw new Error('No image data found in TIFF file.');
        }

        UTIF.decodeImage(arrayBuffer, ifds[0]); // decode first page
        const rgba = UTIF.toRGBA8(ifds[0]);

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = ifds[0].width;
        canvas.height = ifds[0].height;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        imageData.data.set(rgba);
        ctx.putImageData(imageData, 0, 0);

        // Show preview
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        preview.innerHTML = '';
        preview.appendChild(img);

        // Store canvas for download
        window.currentCanvas = canvas;
    } catch (err) {
        console.error('TIFF decoding failed:', err);
        alert('Failed to decode TIFF. The file may be corrupted or in an unsupported format.');
    }
});

downloadBtn.addEventListener('click', function() {
    if (!window.currentCanvas) {
        alert('Please upload a TIFF file first.');
        return;
    }

    const quality = qualitySlider.value / 100;
    window.currentCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted.jpg';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/jpeg', quality);
});
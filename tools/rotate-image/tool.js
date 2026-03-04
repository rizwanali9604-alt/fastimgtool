// Rotate Image
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Create angle selector
const controlsDiv = document.createElement('div');
controlsDiv.style.marginTop = '15px';
controlsDiv.innerHTML = `
    <div>
        <label>Angle: </label>
        <select id="angleSelect">
            <option value="90">90° clockwise</option>
            <option value="180">180°</option>
            <option value="270">90° counterclockwise</option>
        </select>
    </div>
`;
document.querySelector('.tool-box').appendChild(controlsDiv);

const angleSelect = document.getElementById('angleSelect');

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

    const angle = parseInt(angleSelect.value);
    const radians = angle * Math.PI / 180;

    // Calculate new canvas size
    let newWidth, newHeight;
    if (angle === 90 || angle === 270) {
        newWidth = originalImage.height;
        newHeight = originalImage.width;
    } else {
        newWidth = originalImage.width;
        newHeight = originalImage.height;
    }

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');

    ctx.translate(newWidth/2, newHeight/2);
    ctx.rotate(radians);
    ctx.drawImage(originalImage, -originalImage.width/2, -originalImage.height/2);
    ctx.rotate(-radians);
    ctx.translate(-newWidth/2, -newHeight/2);

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rotated.png';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
});
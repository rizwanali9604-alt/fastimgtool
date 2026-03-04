// Flip Image
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null;

// Create direction radio buttons
const controlsDiv = document.createElement('div');
controlsDiv.style.marginTop = '15px';
controlsDiv.innerHTML = `
    <div>
        <label><input type="radio" name="flip" value="horizontal" checked> Horizontal</label>
        <label style="margin-left:15px;"><input type="radio" name="flip" value="vertical"> Vertical</label>
    </div>
`;
document.querySelector('.tool-box').appendChild(controlsDiv);

const flipRadios = document.getElementsByName('flip');

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

    // Get selected flip direction
    let flipH = false, flipV = false;
    for (const radio of flipRadios) {
        if (radio.checked) {
            if (radio.value === 'horizontal') flipH = true;
            else flipV = true;
            break;
        }
    }

    ctx.save();
    ctx.translate(flipH ? canvas.width : 0, flipV ? canvas.height : 0);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(originalImage, 0, 0);
    ctx.restore();

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'flipped.png';
        link.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
});
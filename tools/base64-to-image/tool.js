// Base64 to Image Converter
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

// Replace file input with a textarea for pasting base64
const textarea = document.createElement('textarea');
textarea.placeholder = 'Paste your base64 string here (starting with data:image/...;base64,)';
textarea.rows = 5;
textarea.style.width = '100%';
textarea.style.marginBottom = '15px';
textarea.style.padding = '10px';
textarea.style.background = '#1e293b';
textarea.style.color = '#e6edf7';
textarea.style.border = '1px solid #2a3a5a';
textarea.style.borderRadius = '8px';
document.querySelector('.tool-box').insertBefore(textarea, fileInput.parentNode);

// Hide the original file input
fileInput.style.display = 'none';

// Add a "Convert" button (we'll repurpose download button)
downloadBtn.addEventListener('click', function() {
    const base64 = textarea.value.trim();
    if (!base64) {
        alert('Please paste a base64 string.');
        return;
    }
    // Validate base64 format
    if (!base64.startsWith('data:image/')) {
        alert('Invalid base64 image string. It should start with "data:image/..."');
        return;
    }

    try {
        // Create an image from base64
        const img = new Image();
        img.onload = () => {
            preview.innerHTML = '';
            preview.appendChild(img);

            // Create download link
            const link = document.createElement('a');
            link.href = base64;
            link.download = 'image.' + base64.split(';')[0].split('/')[1]; // extract extension
            link.click();
        };
        img.onerror = () => {
            alert('Failed to load image. Check your base64 string.');
        };
        img.src = base64;
    } catch (err) {
        alert('Error processing base64: ' + err.message);
    }
});
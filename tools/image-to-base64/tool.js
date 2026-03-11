// Image to Base64 Converter
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

// Create a textarea for displaying Base64
const textarea = document.createElement('textarea');
textarea.rows = 6;
textarea.style.width = '100%';
textarea.style.marginTop = '15px';
textarea.style.padding = '10px';
textarea.style.background = '#1e293b';
textarea.style.color = '#e6edf7';
textarea.style.border = '1px solid #2a3a5a';
textarea.style.borderRadius = '8px';
textarea.readOnly = true;
document.querySelector('.tool-box').appendChild(textarea);

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        // event.target.result is the base64 string (includes data:image/...;base64,)
        const base64 = event.target.result;
        textarea.value = base64;

        // Also show preview
        const img = new Image();
        img.onload = () => {
            preview.innerHTML = '';
            preview.appendChild(img);
        };
        img.src = base64;
    };
    reader.readAsDataURL(file);
});

downloadBtn.addEventListener('click', function() {
    if (!textarea.value) {
        alert('Please upload an image first.');
        return;
    }
    // Download the base64 string as a text file
    const blob = new Blob([textarea.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'base64.txt';
    link.click();
    URL.revokeObjectURL(url);
});
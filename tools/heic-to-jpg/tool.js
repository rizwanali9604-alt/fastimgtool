// HEIC to JPG Converter
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

fileInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    // Accept .heic files
    if (!file.name.toLowerCase().endsWith('.heic')) {
        alert('Please select a .heic file.');
        return;
    }

    // Show loading message
    preview.innerHTML = '<p>Converting... please wait.</p>';

    try {
        // Convert using heic2any
        const conversionResult = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9
        });
        // conversionResult can be a blob or an array of blobs (if multiple images)
        const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        const url = URL.createObjectURL(blob);
        
        // Display preview
        const img = new Image();
        img.onload = () => {
            preview.innerHTML = '';
            preview.appendChild(img);
        };
        img.src = url;

        // Store blob for download
        window.currentBlob = blob;
    } catch (err) {
        preview.innerHTML = '<p style="color:red;">Conversion failed. Please try another file.</p>';
        console.error(err);
    }
});

downloadBtn.addEventListener('click', function() {
    if (!window.currentBlob) {
        alert('Please convert a HEIC image first.');
        return;
    }
    const url = URL.createObjectURL(window.currentBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted.jpg';
    link.click();
    URL.revokeObjectURL(url);
});
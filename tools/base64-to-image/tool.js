// Base64 to Image – with persistent loading
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');
const toolBox = document.querySelector('.tool-box');

// Create loading indicator
const loadingMsg = document.createElement('div');
loadingMsg.id = 'loadingMessage';
loadingMsg.innerHTML = '⏳ Processing your image...<br><small>This may take 1-2 minutes for large files.<br>Download will start automatically when ready.</small>';
loadingMsg.style.display = 'none';
loadingMsg.style.margin = '15px 0';
loadingMsg.style.padding = '12px';
loadingMsg.style.background = '#1e293b';
loadingMsg.style.color = '#4da3ff';
loadingMsg.style.borderRadius = '8px';
loadingMsg.style.textAlign = 'center';
loadingMsg.style.fontWeight = 'bold';

// Create textarea
const textarea = document.createElement('textarea');
textarea.placeholder = 'Paste your base64 string here (starting with data:image/...;base64,)';
textarea.rows = 5;
textarea.style.width = '100%';
textarea.style.marginBottom = '15px';
textarea.style.padding = '12px';
textarea.style.background = '#1e293b';
textarea.style.color = '#e6edf7';
textarea.style.border = '1px solid #2a3a5a';
textarea.style.borderRadius = '8px';
textarea.style.fontFamily = 'monospace';

// Insert elements
if (toolBox) {
    toolBox.insertBefore(textarea, fileInput);
    toolBox.appendChild(loadingMsg);
}

// Hide file input
if (fileInput) fileInput.style.display = 'none';

downloadBtn.addEventListener('click', async function() {
    const base64 = textarea.value.trim();
    if (!base64) {
        alert('Please paste a base64 string.');
        return;
    }
    if (!base64.startsWith('data:image/')) {
        alert('Invalid base64. Must start with "data:image/..."');
        return;
    }

    // Show loading and disable button
    loadingMsg.style.display = 'block';
    downloadBtn.disabled = true;
    preview.innerHTML = ''; // Clear previous preview

    try {
        // Load the image (this may take time for large base64)
        const img = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = base64;
        });

        // Show preview
        preview.innerHTML = '';
        preview.appendChild(img);

        // Extract mime and extension
        const mimeMatch = base64.match(/data:([^;]+);/);
        if (!mimeMatch) throw new Error('Could not determine image type');
        const mime = mimeMatch[1];
        const ext = mime.split('/')[1];

        // Create canvas and download
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const blob = await new Promise(resolve => canvas.toBlob(resolve, mime));
        if (!blob) throw new Error('Failed to create image blob');

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.' + ext;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Keep loading message visible for 5 seconds to indicate download started
        // After that, hide it (download should be in progress)
        setTimeout(() => {
            loadingMsg.style.display = 'none';
            downloadBtn.disabled = false;
        }, 5000);
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to process image. Check console for details.');
        loadingMsg.style.display = 'none';
        downloadBtn.disabled = false;
    }
});
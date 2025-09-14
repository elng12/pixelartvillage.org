// Image processing utilities for pixel art conversion
function pixelateImage(imageData, pixelSize) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = function() {
      const width = img.width;
      const height = img.height;
      
      canvas.width = width;
      canvas.height = height;
      
      // Disable image smoothing for pixel art effect
      ctx.imageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      
      // Draw the image scaled down then back up to create pixel effect
      const scaledWidth = Math.floor(width / pixelSize);
      const scaledHeight = Math.floor(height / pixelSize);
      
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);
    };
    
    img.src = imageData;
    return canvas.toDataURL();
  } catch (error) {
    console.error('Image processing error:', error);
    return imageData;
  }
}

function applyImageFilters(imageData, brightness, contrast, saturation) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply CSS filters
      ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%)`;
      ctx.drawImage(img, 0, 0);
    };
    
    img.src = imageData;
    return canvas.toDataURL();
  } catch (error) {
    console.error('Filter application error:', error);
    return imageData;
  }
}
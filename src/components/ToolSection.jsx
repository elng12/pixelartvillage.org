import React, { useRef, useState, useEffect, useCallback } from 'react';
import { downscaleFileToBlob, loadImageFromFile } from '../utils/resizeImage';
import { PREVIEW_LIMIT } from '../utils/constants';

function ToolSection({ onImageUpload }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [compact, setCompact] = useState(false);
  const lastUrlRef = useRef(null);

  useEffect(() => {
    const evaluate = () => setCompact(window.innerHeight <= 900);
    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  const handleFileSelect = useCallback(async (file) => {
    setError(''); // 新交互开始时主动清理旧错误
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File is too large. Please upload an image smaller than 10MB.');
        return;
      }
      // 预检图片尺寸，如过大则先在前端做等比 contain 下采样以便预览/编辑
      const MAX_PREVIEW_DIM = PREVIEW_LIMIT.maxEdge;
      try {
        const { img, url: tmpUrl } = await loadImageFromFile(file);
        const needsDownscale = Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height) > MAX_PREVIEW_DIM;
        URL.revokeObjectURL(tmpUrl);
        let finalUrl;
        if (needsDownscale) {
          const blob = await downscaleFileToBlob(file, MAX_PREVIEW_DIM, { preferPng: file.type === 'image/png', quality: 0.9, pixelated: false });
          finalUrl = URL.createObjectURL(blob);
        } else {
          finalUrl = URL.createObjectURL(file);
        }
        if (lastUrlRef.current) {
          try { URL.revokeObjectURL(lastUrlRef.current); } catch (e) { if (import.meta?.env?.DEV) console.warn('revokeObjectURL failed', e) }
        }
        lastUrlRef.current = finalUrl;
        onImageUpload(finalUrl);
        const live = document.getElementById('upload-live');
        if (live) live.textContent = `Selected file: ${file.name}`;
      } catch (e) {
        setError('Failed to prepare image. Please try another file.');
        if (import.meta?.env?.DEV) console.error(e);
      }
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setError('');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <section id="tool" className="bg-gray-50 py-6">
      <div className="container mx-auto px-4 text-center">
        <h1 className={`${compact?'text-2xl md:text-4xl':'text-3xl md:text-5xl'} font-extrabold text-gray-800 mb-3`}>
          Pixel Art Village: Your Ultimate Pixel Art Converter
        </h1>
        <p className={`${compact?'text-sm':'text-base'} text-gray-600 mb-6 max-w-4xl md:max-w-5xl mx-auto`}>
          Pixel Art Village is the best place for a pixel art online experience. Use our pixel converter to quickly turn PNG to pixel art or JPG to pixel art with crisp, grid-friendly results. Pixel Art Village makes creating effortless—adjust pixels, preview instantly, and export clean images. Start crafting unique retro visuals with Pixel Art Village today.
        </p>
        <div 
          className={`upload-zone max-w-3xl mx-auto bg-white ${compact?'p-6':'p-8'} border-2 border-dashed border-gray-300 rounded-xl transition-all hover:border-blue-500 hover:bg-blue-50`}
          role="button"
          tabIndex={0}
          aria-label="Upload image (drag and drop or click to choose)"
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          data-testid="upload-zone"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            aria-label="Choose image file"
            onChange={handleFileInputChange}
            onClick={(e)=>{ e.target.value=''; }}
            data-testid="file-input"
          />
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z" /></svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-700">
              Drag your image here or <span className="text-blue-600">click to choose</span>
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Supports PNG, JPG, GIF — up to 10MB
            </p>
            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert" aria-live="polite">{error}</p>
            )}
            <div className="mt-4">
              <button type="button" className="btn-primary" data-testid="choose-file-btn">Choose file</button>
            </div>
            <p id="upload-live" className="sr-only" aria-live="polite" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ToolSection;
